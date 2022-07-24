<div id="top"></div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
        <a href="#about-the-project">About The Project</a>
        <ul>
            <li><a href="#built-with">Built With</a></li>
        </ul>
    </li>
    <li>
        <a href="#project-setup">Project Setup</a>
        <ul>
            <li><a href="#prerequisites">Prerequisites</a></li>
        </ul>
    </li>
    <li>
        <a href="#project-dependencies">Project Dependencies</a>
        <ul>
            <li><a href="#next-js">Next.js</a></li>
        </ul>
        <ul>
            <li><a href="#mdbootstrap">MDBootstrap</a></li>
        </ul>
        <ul>
            <li><a href="#recoil">Recoil</a></li>
        </ul>
        <ul>
            <li><a href="#wallet-connect">Wallet Connect</a></li>
        </ul>
        <ul>
            <li><a href="#cypress">Cypress</a></li>
        </ul>
        <ul>
            <li><a href="#storybook">Storybook</a></li>
        </ul>
    </li>
    <li>
        <a href="#deploy">Deploy</a>
        <ul>
            <li><a href="#deploy-to-kubernetes-cluster">Deploy to Kubernetes Cluster</a></li>
        </ul>
        <ul>
            <li><a href="#deploy-with-vercel">Deploy with Vercel</a></li>
        </ul>
    </li>
    <li>
        <a href="#notes">Notes</a>
    </li>
  </ol>
</details>

# About The Project

Use the `README.md` to get started.

<p align="right">(<a href="#top">back to top</a>)</p>

## Built With
         
These are all the major project dependencies used in the project.

* [Next.js](https://nextjs.org/) ([React.js](https://reactjs.org/))
* [MDBootstrap](https://mdbootstrap.com/)
* [Recoil](https://recoiljs.org/)
* [Moralis](https://moralis.io/)
* [Wallet Connect](https://walletconnect.com/)
* [Cypress](https://www.cypress.io/)
* [Storybook](https://storybook.js.org/)

<p align="right">(<a href="#top">back to top</a>)</p>

# Project setup 

## Prerequisites

To setup the project.
* [npm](https://www.npmjs.com/)  
or
* [yarn](https://www.npmjs.com/package/yarn)
* [docker](https://www.docker.com/)
* [kubernetes](https://kubernetes.io/)

## Next.js

```bash
npx create-next-app lore
# or
yarn create next-app lore
```

<p align="right">(<a href="#top">back to top</a>)</p>

# Project Dependencies
## MDBootstrap  
```bash
npm install --save mdbreact @zeit/next-css next-fonts next-images next-compose-plugins
```  

### Add to next.config.js  
```bash
const withCSS = require('@zeit/next-css');
const withFonts = require('next-fonts');
const withImages = require('next-images');
const withPlugins = require("next-compose-plugins");

module.exports = withPlugins([withCSS, withFonts, withImages]);
```

### Imports in index.js  
```bash
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
```

## Recoil 
```bash
npm i --save recoil 
# or 
yarn add recoil
``` 

## Moralis  
```bash
npm install moralis react-moralis
```

## Wallet Connect
```bash
npm i @walletconnect/web3-provider
```

### Fix for Ethereum JS after Wallet Connect install
```bash
# change
"resolved": "git+ssh://git@github.com/ethereumjs/ethereumjs-abi.git#ee3994657fa7a427238e6ba92a84d0b529bbcde0"
# to 
"resolved": "https://registry.npmjs.org/ethereumjs-abi/-/ethereumjs-abi-0.6.8.tgz"
```

## Cypress
```bash
npm i cypress -D  
# or 
yarn add cypress -D
```

## Storybook  
```bash
npx sb init --builder webpack5 
```
Run Storybook
```bash
npm run storybook
```

<p align="right">(<a href="#top">back to top</a>)</p>

# Deploy 
## Deploy to Kubernetes Cluster

https://www.docker.com/

https://kubernetes.io/

<p align="right">(<a href="#top">back to top</a>)</p>

## Deploy with Vercel

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-typescript&project-name=with-typescript&repository-name=with-typescript)

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

<p align="right">(<a href="#top">back to top</a>)</p>

# Notes

<p align="right">(<a href="#top">back to top</a>)</p>

