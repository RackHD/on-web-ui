Copyright 2015, EMC, Inc.

# App Tutorial (WIP)

On Web UI is a project for making cutting edge web application development as easy of a process as possible.

The goal is to give developers who are new to front end development a straight forward approach.

## Create a new tutorial application.

You can create a new web application using `slush` generators. Make sure your current working directory is the `on-web-ui` project directory.

```bash
$ npm install slush -g
$ slush app
```

You will be asked the name of you app and what the directory name should be. They will most likely be the same except directory names should be lowercase.

<img src="/handbook/slush-app-tutorial-a.png" width="60%" alt="Output">

There are other useful `slush app` generators and a few more of them will be covered in this tutorial. See the [Scaffolding section](#/guides/scaffolding) for more information on all available generators.

You may have to restart `gulp` for the new app to build, and then it will be serve-able.

```bash
$ gulp
```

Once the new tutorial app is built and being served on `localhost:3000` by using `gulp` you can view it in your browser.

<img src="/handbook/slush-app-tutorial-b.png" width="80%" alt="App">

The login form in the above screenshot is a placeholder view from `common-web-ui` which is the `npm` name of the `./apps/common` app library.

## Create a new view.

```bash
$ slush app:view
```
