https://updraft.cyfrin.io/courses/full-stack-web3-development-crash-course/ts-nft-marketplace/graphql
https://github.com/joshstevens19/rindexer
sudo apt update
sudo apt install docker-compose
docker-compose up -d

curl -L https://rindexer.xyz/install.sh | bash
rindexer --help
rindexer new no-code
project: nftMarketplace
cd nftMarketplace

do forge build --via-ir
and copy the abi so marketplaceIndexer/abi, for next step
rindexer.yaml:
name: marketplaceIndexer
project_type: no-code
networks:

- name: anvil
  chain_id: 31337
  rpc: http://127.0.0.1:8545 # Can use environment variables too!
  storage:
  postgres:
  enabled: true
  csv:
  enabled: true
  path: ./generated_csv
  native_transfers:
  enabled: false
  contracts:
- name: NftMarketplace
  details:
    - network: anvil
      address: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
      start_block: '0'
      abi: ./abis/NftMarketplace.abi.json
      include_events:
    - ItemListed
    - ItemCanceled
    - ItemBought

cat <<EOF > .env
DATABASE_URL=postgresql://postgres:rindexer@localhost:5440/postgres
POSTGRES_PASSWORD=rindexer
EOF
source .env

docker ps --format 'table {{.Names}}\t{{.Ports}}' | grep -i postgres
docker-compose up -d postgres # or just:
docker compose up -d
docker compose up -d
docker compose config --services
docker-compose up -d postgresql

rindexer start indexer

rindexer start all

../next.config.ts

### terminal 5: tests

pnpm add -D @synthetixio/synpress

#### graphql

rindexer start both

# set Docker daemon DNS

sudo mkdir -p /etc/docker
printf '{\n "dns": ["8.8.8.8", "1.1.1.1"],\n "registry-mirrors": ["https://mirror.gcr.io"]\n}\n' | sudo tee /etc/docker/daemon.json

# restart docker

sudo systemctl restart docker

# quick sanity check

docker info | grep -i dns
