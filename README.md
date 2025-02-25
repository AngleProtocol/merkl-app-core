
## License

This project is licensed under the **BSD 3-Clause License with Specific Usage Restrictions**.

### Key Terms

- **Permitted Use**: This software may only be used to develop applications (frontend or backend) that directly interface with the Merkl incentive distribution solution.
- **Prohibited Uses**:
  - Developing standalone applications unrelated to the original backend.
  - Creating competitive backend services or applications.
  - Reverse engineering the core backend logic.
  - Developing alternative backend implementations.
- **Commercial Use**: Commercial use of this software, including incorporating it into paid products or services, is **strictly prohibited without prior written approval** from Angle Labs, Inc. For inquiries regarding commercial use, contact [contact@merkl.xyz](contact@merkl.xyz)

### Full License

For detailed terms and conditions, refer to the [`LICENSE`](./LICENSE) file in this repository.


# Welcome to Merkl Lite !

## Prerequisites

- [Bun](https://bun.sh/)
- [Remix](https://remix.run/docs)

## Installation

1. `git submodule update --init --recursive`
2. `bun i`
3. `bun dev`


## Development

Run the dev server:

```shellscript
bun dev
```


## Deployment

### Host with Docker (recommended)

First you will need to build and push the image to a docker registry

1. Setup a Docker registry if you don't have one (on [DockerHub](https://hub.docker.com/) for example)
2. Go to the root of this repository
3. Build the docker container: `docker build --tag <REGISTRY_URL>/merkl-lite:latest .`
4. Push it to your registry: `docker push <REGISTRY_URL>/merkl-lite:latest`

Now you will need to deploy the container, here are a few hosting solutions:

- [Cloud Run](https://cloud.google.com/run) on Google Cloud
- [ECS Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html) on AWS
- Docker-compose on any VM

Then you only need to set the PORT environment variable and it will work! We recommend setting the port to 5173 (it is exposed in the Dockerfile) but feel free to change it.

### Host it yourself

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.

## Updating a fork

When pulling changes from `merkl-lite`, you have to:

```
# (On the forked repository)

# Fetch commits on merkl lite
git fetch merkl-lite

# Open a branch from main
git checkout main
git checkout -b sync

# Merge changes from upstream
git merge merkl-lite/main

# Open a sync PR
```
