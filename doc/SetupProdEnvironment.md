
## Setup The Prod Environment

## Global stuff, NSPs

1. make sure you are in the prod project
```console
oc project ...-prod
```

2. create ./openshift/templates/nsp-fpcare-to-maximus-prod.yaml  (copy from -dev.yaml)
   change the IP of proxy to prod proxy
   the apply using:
```console
oc process -f nsp-fpcare-to-maximus-prod.yaml \
  -p NAMESPACE=$(oc project --short) | \
  oc apply -f -
```

3. apply the internal NSPs:
```console
oc process -f nsp-fpcareweb-to-all.yaml \
  -p NAMESPACE=$(oc project --short) | \
  oc apply -f -
```
4. allow the prod project to pull from tools:
   Go to the prod project (oc project 3f9283-prod).
```console
oc policy add-role-to-user system:image-puller system:serviceaccount:$(oc project --short):default -n 3f9283-tools
```

## For each of the nodeJS apps, ie. splunk-forwarder, msp-service, captcha-service, spa-env-server
## (for example spa-env-server)

1. go to spa-env-server/openshift/templates

2. create the params-prod.txt file, fill the env variables from openshift 3 env values for spa-env-server

3. create the trio of dc, service, routes using the deploy.yaml file:
```console
oc process -f openshift/templates/deploy.yaml --param-file=params-prod.txt | oc apply -f -
```

## deal with the github workflows

1. go to the top level's .github directory

2. go to the workflow directory

3. check that everything in the deploy to prod action is correct.

4. go to github, then actions, then try it.


## For the FPC application

1. go to the fpcare directory

2. go to openshift/templates

3. create the params-prod.txt file, fill the env variables from openshift 3 env values for spa-env-server

4. create the config artifact in the prod project by doing an oc process on config.yaml
```console
oc process -f openshift/templates/config.yaml --param-file=params-prod.txt | oc apply -f -
```
5. create the trio of dc, service, routes using the deploy.yaml file:
```console
oc process -f openshift/templates/deploy.yaml --param-file=params-prod.txt | oc apply -f -
```

## some checks in the new prod environment (and compare with dev):

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
   oc get ne
   oc get ns ... -o yaml

5. check secrets
   oc get secrets

