#!/bin/bash

set -e # Exit with nonzero exit code if anything fails

echo "-- start"

SOURCE_BRANCH="${SOURCE_BRANCH:-master}"
TARGET_BRANCH="${TARGET_BRANCH:-gh-pages}"
DEPLOY_DIR="${DEPLOY_DIR:-public}"

ROOT_DIR=$(pwd)


# Save some useful information
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`

echo "   * Variables"
echo "     – SOURCE_BRANCH=${SOURCE_BRANCH}"
echo "     – TARGET_BRANCH=${TARGET_BRANCH}"
echo "     – DEPLOY_DIR=${DEPLOY_DIR}"
echo "     – COMMIT_AUTHOR_EMAIL=${COMMIT_AUTHOR_EMAIL}"
echo "     – REPO=${REPO}"
echo "     – REPO=${REPO}"
echo "     – SSH_REPO=${SSH_REPO}"
echo "     – SHA=${SHA}"

openssl version


# Pull requests and commits to other branches shouldn't try to deploy, just build to verify
if [ $DRONE ]; then

  echo "     – DRONE_BUILD_EVENT=${DRONE_BUILD_EVENT}"
  echo "     – DRONE_COMMIT_BRANCH=${DRONE_COMMIT_BRANCH}"

  if [ "$DRONE_BUILD_EVENT" != "push" -o "$DRONE_COMMIT_BRANCH" != "$SOURCE_BRANCH" ]; then
      echo "Skipping deploy; just doing a build."
      exit 0
  fi
fi

# Pull requests and commits to other branches shouldn't try to deploy, just build to verify
if [ $TRAVIS ]; then

  echo "     – TRAVIS_PULL_REQUEST=${TRAVIS_PULL_REQUEST}"
  echo "     – TRAVIS_BRANCH=${TRAVIS_BRANCH}"

  if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" ]; then
      echo "Skipping deploy; just doing a build."
      exit 0
  fi
fi




# Clone the existing gh-pages for this repo into $DEPLOY_DIR/
# Create a new empty branch if gh-pages doesn't exist yet (should only happen on first deply)
echo "   * get repo"
git clone $REPO $DEPLOY_DIR
cd $DEPLOY_DIR
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH
cd $ROOT_DIR

# Clean out existing contents and save git
echo "   * clean up"
cd $ROOT_DIR
mkdir __save_git
mv $DEPLOY_DIR/.git __save_git/
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# Run our compile script
echo "   * build"
sh ./ci/build.sh

# restore git
cd $ROOT_DIR
mv __save_git/.git $DEPLOY_DIR/
rm -rf __save_git


# Now let's go have some fun with the cloned repo
cd $DEPLOY_DIR
echo "   * build info"

git config user.name "CI System"
git config user.email "$COMMIT_AUTHOR_EMAIL"

# If there are no changes to the compiled out (e.g. this is a README update) then just bail.
if [ $(git status --porcelain | wc -l) -lt 1 ]; then
    echo "   * No changes to the output on this push; exiting."
    exit 0
fi

# Commit the "changes", i.e. the new version.
# The delta will show diffs between new and old versions.
git add -A .
git commit -m "Deploy to GitHub Pages: ${SHA}"

# Get the deploy key by using stored variables to decrypt id_rsa.enc
# sha256 set to have openssl 1 & 2 compatibility
eval `ssh-agent -s`
openssl aes-256-cbc -md sha256 -d -in "$ROOT_DIR/ci/.ssh/id_rsa.enc" -pass "pass:$DECRYPT_KEY" | ssh-add -

# add github as known host
mkdir -p ~/.ssh
ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts

# Now that we're all set up, we can push.
echo "   * push git"
git push $SSH_REPO $TARGET_BRANCH
