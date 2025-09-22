# Proxy Support for Split.io Evaluator

The Split.io Evaluator now supports HTTP/HTTPS proxy configuration for environments where direct internet access is restricted, such as corporate networks.

## Features

- **Automatic Proxy Detection**: Uses standard environment variables
- **Multiple Protocol Support**: Supports both HTTP and HTTPS proxies
- **NO_PROXY Support**: Allows bypassing proxy for specific domains
- **Optional Dependency**: Proxy support is optional and doesn't affect installations without proxy needs
- **Graceful Fallback**: Works normally when proxy packages are not available

## Environment Variables

The evaluator supports the following standard proxy environment variables (in order of priority):

### Proxy Configuration
- `HTTPS_PROXY` - HTTPS proxy URL (highest priority)
- `https_proxy` - HTTPS proxy URL (lowercase variant)
- `HTTP_PROXY` - HTTP proxy URL
- `http_proxy` - HTTP proxy URL (lowest priority)

### Proxy Bypass
- `NO_PROXY` - Comma-separated list of domains/IPs to bypass proxy
- `no_proxy` - Lowercase variant of NO_PROXY

## Usage Examples

### Basic Proxy Configuration

```bash
# Set HTTPS proxy
export HTTPS_PROXY=http://proxy.company.com:8080

# Set HTTP proxy as fallback
export HTTP_PROXY=http://proxy.company.com:8080

# Start the evaluator
npm start
```

### With Authentication

```bash
# Proxy with username and password
export HTTPS_PROXY=http://username:password@proxy.company.com:8080
```

### Bypass Specific Domains

```bash
# Configure proxy
export HTTPS_PROXY=http://proxy.company.com:8080

# Bypass internal domains and localhost
export NO_PROXY=localhost,127.0.0.1,*.internal.com,metadata.service

# Start the evaluator
npm start
```

### Docker Environment

```dockerfile
# In your Dockerfile or docker-compose.yml
ENV HTTPS_PROXY=http://proxy.company.com:8080
ENV NO_PROXY=localhost,127.0.0.1,*.svc.cluster.local
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: split-evaluator
spec:
  template:
    spec:
      containers:
      - name: split-evaluator
        image: splitsoftware/split-evaluator:latest
        env:
        - name: HTTPS_PROXY
          value: "http://proxy.company.com:8080"
        - name: NO_PROXY
          value: "localhost,127.0.0.1,*.svc.cluster.local"
```

## Installation

### With Proxy Support (Recommended)

```bash
npm install
```

The `https-proxy-agent` package is included as an optional dependency and will be installed automatically.

### Without Proxy Support

If you don't need proxy support, you can skip the optional dependency:

```bash
npm install --no-optional
```

## Troubleshooting

### Proxy Not Working

1. **Check Environment Variables**: Ensure proxy environment variables are set correctly
   ```bash
   echo $HTTPS_PROXY
   echo $NO_PROXY
   ```

2. **Check Logs**: Look for proxy configuration messages in the evaluator logs
   ```
   Split.io SDK configured to use proxy: http://proxy.company.com:8080
   ```

3. **Verify Proxy URL**: Ensure the proxy URL is accessible and correct

### Warning Messages

If you see this warning:
```
Proxy configuration detected but https-proxy-agent package is not available. Install https-proxy-agent to enable proxy support.
```

Install the proxy agent package:
```bash
npm install https-proxy-agent
```

### NO_PROXY Patterns

The NO_PROXY environment variable supports:
- **Exact matches**: `example.com`
- **Wildcard domains**: `*.example.com` (matches subdomains)
- **IP addresses**: `192.168.1.1`
- **IP ranges**: Not supported (use specific IPs)

## Technical Details

### Proxy Priority

The evaluator checks proxy environment variables in this order:
1. `HTTPS_PROXY`
2. `https_proxy`
3. `HTTP_PROXY`
4. `http_proxy`

### Split.io Domains

By default, all Split.io API calls will use the configured proxy:
- `sdk.split.io`
- `auth.split.io`
- `events.split.io`

To bypass proxy for Split.io domains (not recommended in corporate environments):
```bash
export NO_PROXY=*.split.io
```

### Performance Considerations

- Proxy adds minimal overhead to HTTP requests
- Connection pooling is maintained through the proxy
- DNS resolution happens at the proxy level

## Contributing

This proxy support feature was developed to address corporate network restrictions. If you encounter issues or have suggestions for improvements, please:

1. Check existing issues on GitHub
2. Create a detailed issue with your environment details
3. Consider contributing improvements via pull requests

## Security Notes

- Proxy credentials in environment variables may be visible in process lists
- Use secure credential management in production environments
- Ensure proxy servers are properly secured and monitored
- Consider using authenticated proxies in corporate environments
