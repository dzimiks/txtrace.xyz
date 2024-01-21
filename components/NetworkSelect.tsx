import { useEffect, useState } from 'react';
import { ChevronsUpDownIcon } from 'lucide-react';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/index';
import { Network } from '@/types/network';

const NetworkSelect = ({ options, network, setNetwork }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('Mainnet');
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(null);

  useEffect(() => {
    const foundNetwork: Network = options.find((network: Network) => network.name === value);
    setNetwork(foundNetwork?.id || '1');
    setSelectedNetwork(foundNetwork);
  }, [value]);

  useEffect(() => {
    const foundNetwork: Network = options.find((net: Network) => net.id === network);
    setSelectedNetwork(foundNetwork);
  }, [network]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between md:w-[250px]"
        >
          <div className="flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {selectedNetwork?.name && (
              <img
                className="w-6 h-6 rounded-full"
                src={selectedNetwork.logo}
                alt={selectedNetwork.name}
              />
            )}
            <span>{selectedNetwork?.name || 'Select network...'}</span>
          </div>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 md:w-[250px]">
        <Command>
          <CommandInput placeholder="Search network..." />
          <CommandEmpty>No network found.</CommandEmpty>
          <CommandGroup>
            <div className="max-h-[300px] overflow-auto">
              {options.map((network: Network) => (
                <CommandItem
                  key={network.name}
                  value={network.name}
                  onSelect={() => {
                    setValue(network.name);
                    setOpen(false);
                  }}
                >
                  <img
                    className="w-6 h-6 rounded-full mr-2"
                    src={network.logo}
                    alt={network.name}
                  />
                  <span className="font-semibold">{network.name}</span>
                </CommandItem>
              ))}
            </div>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { NetworkSelect };
