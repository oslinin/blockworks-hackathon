import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PredictionMarketFactory from '../abi/PredictionMarketFactory.json';
import { useWeb3 } from '../context/Web3Context';
import contractAddresses from '../abi/contract-addresses.json';

export default function Events() {
    const { provider } = useWeb3();
    const [events, setEvents] = useState([]);
    const [filterAddress, setFilterAddress] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            if (provider) {
                const network = await provider.getNetwork();
                const addresses = network.chainId.toString() === '31337' ? contractAddresses.localhost : contractAddresses.sepolia;
                const factoryContract = new ethers.Contract(addresses.PredictionMarketFactory, PredictionMarketFactory, provider);

                const marketCreatedFilter = factoryContract.filters.MarketCreated();
                const betPlacedFilter = factoryContract.filters.BetPlaced();

                const marketCreatedEvents = await factoryContract.queryFilter(marketCreatedFilter, -50);
                const betPlacedEvents = await factoryContract.queryFilter(betPlacedFilter, -50);

                const allEvents = [...marketCreatedEvents, ...betPlacedEvents];

                const sortedEvents = allEvents.sort((a, b) => a.blockNumber - b.blockNumber);

                setEvents(sortedEvents);
            }
        };
        fetchEvents();
    }, [provider]);

    const filteredEvents = events.filter(event =>
        !filterAddress || (event.args && event.args.user && event.args.user.toLowerCase() === filterAddress.toLowerCase())
    );

    return (
        <div>
            <h1>Events</h1>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Filter by user address"
                    value={filterAddress}
                    onChange={(e) => setFilterAddress(e.target.value)}
                    style={{ width: '400px', border: '1px solid #ccc', padding: '5px', borderRadius: '5px' }}
                />
            </div>
            <div>
                {filteredEvents.map((event, index) => (
                    <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                        <p><strong>Event:</strong> {event.event}</p>
                        <p><strong>Block Number:</strong> {event.blockNumber}</p>
                        <p><strong>User:</strong> {event.args.user}</p>
                        <p><strong>Market:</strong> {event.args.marketAddress}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
