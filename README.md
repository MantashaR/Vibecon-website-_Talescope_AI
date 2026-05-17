# Talescope_AI

This repository contains the prebuilt container image for **`vibecon-web:latest`** in [OCI image layout](https://github.com/opencontainers/image-spec/blob/main/image-layout.md) format.

## What's inside

```
.
├── index.json        # Top-level OCI index
├── manifest.json     # Docker-style manifest (tag: vibecon-web:latest)
├── oci-layout        # OCI layout marker
└── blobs/sha256/     # Content-addressed image layers and configs
```

The image is approximately **21 MB compressed** across 9 layers.

## Using the image

### Option 1 — Load directly with Docker (recommended)

Clone the repo and re-pack the directory into a tarball, then load it:

```bash
git clone https://github.com/MantashaR/Talescope_AI.git
cd Talescope_AI
tar -czf vibecon-web.tar.gz index.json manifest.json oci-layout blobs
docker load -i vibecon-web.tar.gz
docker run --rm -p 8080:8080 vibecon-web:latest
```

### Option 2 — Push to a registry with `crane`

If you have [`crane`](https://github.com/google/go-containerregistry/tree/main/cmd/crane) installed:

```bash
crane push . ghcr.io/<your-user>/vibecon-web:latest
```

### Option 3 — Copy to a registry with `skopeo`

```bash
skopeo copy oci:. docker://ghcr.io/<your-user>/vibecon-web:latest
```

## Notes

- This repo stores the image **as files** rather than in a container registry. For production use, the proper home for an OCI image is a registry like [GitHub Container Registry](https://ghcr.io) or Docker Hub.
- Layer files under `blobs/sha256/` are content-addressed by their SHA-256 digest — do not rename them.

## License

See `LICENSE` if present, otherwise contact the repository owner.
