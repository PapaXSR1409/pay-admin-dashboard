# Pay Admin Dashboard

Pay Admin Dashboard offers a convenient way to get insight into the release pipeline of GOV.UK Pay. The process around releasing software to production entails a sequence of environments that application artifacts are deployed to and a couple of gates that ensures the quality of the deployment. An application artifact starts in TEST environment where it is integrated and tested. Before being allowed to progress, it must be signed by an approver then promoted to each of the following environments, in turn, STAGING and finally PRODUCTION.

Pay Admin Dashboard shows all environments in the deployment pipeline, which artifact version is deployed where and has support for approval, promotion.

https://pay-admin-dashboard.herokuapp.com/

## Getting started

1. Install the project dependencies: `npm install`
2. Open a terminal and execute `export NODE_CONFIG NODE_CONFIG='{"client": {"gitHub": {"accessToken": "XXXXXXXXXXXXXXXXXXXXXXXXc2XXXXeaXXXX9XX"}, "jenkins": {"deployParamBuildUrl": "https://deploy.deploy.payments.service.gov.uk/job/${jobName}/parambuild?DEPLOY_TAG=${deployTag}"}}}'` Please replace 'XXX' with actual accessToken.
3. Launch the application: `npm start`
4. Point your browser to [http://localhost:8000](http://localhost:8000)

## For development

- React Hot Loader can be used to ease your development workflow: `npm run webpack-dev-server`  
- Then in your HTML, change your 'javascript bundles' source paths to point to the webpack-dev-server proxy in your `script` tags. So if you have something like the following:

```html
<script src="/dist/js/vendors.js"></script>
<script src="/dist/js/app.bundle.js"></script>
```

change this to:

```html
<script src="http://localhost:8181/dist/js/vendors.js"></script>
<script src="http://localhost:8181/dist/js/app.bundle.js"></script>
```

Note: `Remember to revert the script source changes when done with development for pushing changes for code review.`


## Licence

[MIT License](LICENSE)

## Responsible Disclosure

GOV.UK Pay aims to stay secure for everyone. If you are a security researcher and have discovered a security vulnerability in this code, we appreciate your help in disclosing it to us in a responsible manner. We will give appropriate credit to those reporting confirmed issues. Please e-mail gds-team-pay-security@digital.cabinet-office.gov.uk with details of any issue you find, we aim to reply quickly.
