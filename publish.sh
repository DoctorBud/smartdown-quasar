#
# Based upon:
#	https://blog.bloomca.me/2017/12/15/how-to-push-folder-to-github-pages.html
#

REMOTE=`git remote get-url --push origin`
rm -rf dist/spa
SMARTDOWN_PREFIX=/smartdown-quasar npm run build
mkdir /tmp/publishSQ
cp -r dist/spa/ /tmp/publishSQ/
cd /tmp/publishSQ/
cp index.html 404.html
ls -l
git init
git add .
git commit -m "Initial commit"
git remote add origin ${REMOTE}
git push --force origin master:gh-pages
