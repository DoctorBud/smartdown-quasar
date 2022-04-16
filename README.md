# Smartdown Editor (smartdown-quasar)

Smartdown Editor via Quasar/VueJS

## Inspirations

- ProseMirror example
- Notepad example


## Install the dependencies

This project uses [yarn]() instead of [npm]() as its package manager. Mostly because it seems that's what the cool kids are using these days.

```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
yarn run lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).


## Useful stuff

- https://mokacoding.com/blog/xcodebuild-destination-options/

- Building an app for iPhone without using `quasar dev:ios`

```
xcrun xcodebuild install -workspace App.xcworkspace -scheme App -configuration release -derivedDataPath /Users/bud/DoctorBud/smartdown-quasar/dist/capacitor/ios -destination "platform=iOS,name=Bud's iPhone"
```

