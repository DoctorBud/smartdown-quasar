#
# Based upon:
#	https://blog.bloomca.me/2017/12/15/how-to-push-folder-to-github-pages.html
#

REMOTE=`git remote get-url --push origin`
rm -rf dist/spa
SMARTDOWN_PREFIX=/smartdown-quasar yarn build
rm -rf /tmp/smartdown-publish/
cp -r dist/spa /tmp/smartdown-publish/
cd /tmp/smartdown-publish/
cp index.html 404.html
git init
git checkout -b master
git checkout -b gh-pages
touch .nojekyll
git add . .nojekyll
git commit -m "Initial commit"
git remote add origin ${REMOTE}
git push --force origin gh-pages
