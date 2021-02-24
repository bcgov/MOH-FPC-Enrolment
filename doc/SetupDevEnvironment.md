
## Setup The Dev Environment

## Global stuff, NSPs

1. make sure you are in the dev project
```console
oc project ...-dev
```


2. **TOBE UPDATED** create ./openshift/templates/nsp-fpcare-to-maximus-dev.yaml  (copy from -dev.yaml)
   change the IP of proxy to dev proxy
   the apply using:
```console
oc process -f nsp-fpcare-to-maximus-dev.yaml \
  -p NAMESPACE=$(oc project --short) | \
  oc apply -f -
```

3. **TOBE UPDATED** apply the internal NSPs:
```console
oc process -f nsp-fpcareweb-to-all.yaml \
  -p NAMESPACE=$(oc project --short) | \
  oc apply -f -
```

4. allow the dev project to pull from tools:
   Go to the dev project (oc project 3f9283-dev).
```console
oc policy add-role-to-user system:image-puller system:serviceaccount:$(oc project --short):default -n 3f9283-tools
```

## For each of the nodeJS apps, ie. splunk-forwarder, msp-service, captcha-service, spa-env-server
## (for example spa-env-server)

1. go to spa-env-server/openshift/templates

2. create the params-dev.txt file, fill the env variables from openshift 3 env values for spa-env-server

3. create the trio of dc, service, routes using the deploy.yaml file:
```console
oc process -f openshift/templates/deploy.yaml --param-file=params-dev.txt | oc apply -f -
```

## deal with the github workflows

1. go to the top level's .github directory

2. go to the workflow directory

3. check that everything in the deploy to dev action is correct.

4. go to github, then actions, then try it.


## For the FPC application

1. go to the fpcare directory

2. go to openshift/templates

3. create the params-dev.txt file, fill the env variables from openshift 3 env values for spa-env-server

4. create the config artifact in the dev project by doing an oc process on config.yaml
```console
oc process -f openshift/templates/config.yaml --param-file=params-dev.txt | oc apply -f -
```
5. create the trio of dc, service, routes using the deploy.yaml file:
```console
oc process -f openshift/templates/deploy.yaml --param-file=params-dev.txt | oc apply -f -
```

## some checks in the new dev environment (and compare with dev):

1. check the dc's
   oc get dc
   oc describe dc/spa-env-server...

   pay attention to roles, make sure they're ok.
   in cases of not working, delete the objects and recreate.

2. check the config
   use console?

3. check the nsp
   oc get nsp
   oc get nsp ... -o yaml

   pay attention to roles.
   in cases of not working, delete the objects and recreate.

4. check the external networks
   oc get en
   oc get ne ... -o yaml

5. check secrets
   oc get secrets


**Switch Apporeto to Kubernetes network policy (Feb 22, 2021)**
**Note: Supports both Apporeto and Kubernetes in the interim**
These are the steps for updating the network policies:
a) Make sure you are in dev
b) Run command to find network policies and end points
```console
    oc get nsp
```

And obtain names, and delete it, i.e.
```console
oc delete nsp address-service-to-address-doctor fpcare-to-address-service \ 
    fpcare-to-captcha-service fpcare-to-msp-service fpcare-to-spa-env-server \
    fpcare-to-splunk-forwarder fpincome-to-address-service fpincome-to-captcha-service \
    fpincome-to-msp-service fpincome-to-spa-env-server fpincome-to-splunk-forwarder \
    msp-service-to-cloudflare msp-service-to-maximus-servers msp-service-to-splunk-forwarder \
    splunk-forwarder-to-cloudflare splunk-forwarder-to-maximus-servers

oc get en
```

And obtain names, then delete, ie:
```console
oc delete en addressdoctor cloudflare maximus-servers

```

c) Apply the quickstart, apps can access all (for dev, make sure your default oc project is dev):

```console
oc process -f openshift/templates/quickstart.yaml \
    NAMESPACE_PREFIX=3f9283 -p ENVIRONMENT=dev | \
    oc apply -f -
```

Verify that 3 network policies (Keburnetes) and 2 network security policies (Apporeto) were created:
```console
oc get nsp
oc get networkpolicy
```

To look more in detail, for example:
```console
oc describe nsp/any-to-any
oc describe networkpolicy/allow-all-internal
```
d) Apply the quickfpcare-to-all and quickfpincome-to-all to setup one-to-one access to pods
```console
oc process -f openshift/templates/quickfpcare-to-all.yaml \
    -p NAMESPACE=$(oc project --short) | \
    oc apply -f -

oc process -f openshift/templates/quickfpincome-to-all.yaml \
    -p NAMESPACE=$(oc project --short) | \
    oc apply -f -
```