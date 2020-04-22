# csye7220_blogApp_backend

There are three basic procedures for deploying the project into AWS EKS.

1. Build up AWS EKS cluster 
2. Apply Kubernetes services and deployments files into the cluster 
3. Apply Prometheus and Grafana services

## Prerequisite
1. terraform installed
2. Kubernetes installed
```
minikube start
```
3. This repo is for backend part, to build up the whole App, you need to clone the frontend part.
```
git clone https://github.com/doijodeharishamogh/Transitblog-client-customer
```
For instance, create a folder like below and copy and paste both frontend repo and backend repo into relative folders:
```
Project
 |
 +-- client
 |    
 +-- server
```


## First Step
Using ```/aws-eks``` folder to set up AWS EKS cluster and build ConfigMap

```bash
cd client/aws-eks/1.vpc
terraform init
terraform plan
terraform apply

cd ../2.eks
terraform init
terraform plan
terraform apply

#build ConfigMap
terraform output kubeconfig 
terraform output kubeconfig > ~/.kube/config-terraform-eks-demo 
export KUBECONFIG=~/.kube/config-terraform-eks-demo:~/.kube/config 
echo "export KUBECONFIG=${KUBECONFIG}" >> ${HOME}/.bash_profile 
terraform output config_map_aws_auth 
terraform output config_map_aws_auth > /tmp/config-map-aws-auth.yml 
kubectl apply -f /tmp/config-map-aws-auth.yml 
```

## Second Step
Apply Kubernetes services and deployments files into the cluster


```bash
# Build client and server's services
cd server/
kubectl apply -f server-app-service.yaml
cd client/
kubectl apply -f client-app-service.yaml

# Add client service's URL to the backend, vice versa
kubectl get svc

vi client/client-app-deploy.yaml
# You need to change the REACT_APP_baseAPIURL value into the backend URL
vi server/configs.yaml
# You need to change the CLIENT value into the frontend URL

# Build client and server's deployments
kubectl apply -f configs.yaml
kubectl apply -f server-app-deploy.yaml
cd ../client
kubectl apply -f client-app-deploy.yaml
```


## Third Step
Apply Prometheus and Grafana services
```bash
cd server/Prometheus&Grafana
```

Prometheus:
```bash
kubectl create namespace monitoring
kubectl create -f clusterRole.yaml
kubectl create -f config-map.yaml
kubectl create -f prometheus-deployment.yaml
kubectl get deployments --namespace=monitoring
kubectl create -f prometheus-service.yaml --namespace=monitoring
kubectl get svc --namespace=monitoring
```
Grafana:
```bash
kubectl create -f grafana-datasource-config.yaml
kubectl create -f grafana-datasource-deploy.yaml
kubectl create -f grafana-datasource-service.yaml
kubectl get svc --namespace=monitoring
Import Dashboard with ID 315

```

## Congratulations! You have all things running now!
To see Prometheus&Grafana running status:
```bash
kubectl get svc --namespace=monitoring
```
You can see these to services status, to see Prometheus, visit throw 8080 port, to see Grafana, visit throw 3000 port.
