# kafka-stream-integrator

## How to Run the Workspace

To run the workspace, follow these steps:

1. Make sure you have [pnpm](https://pnpm.io/) installed on your system.

2. Install the project dependencies using pnpm:

```bash
pnpm install
```

3. Build

```bash
pnpm build
```

4. Set env

```
// .env
KAFKA_SOURCE_TOPIC_PATTERN=^my_server.local..* // my_server.local.*
```

5. Start

```bash
pnpm start
```

## Authors

- swpark - [@swpark6](https://github.com/swpark6)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
