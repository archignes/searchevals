"use client"

import React, { useContext } from 'react'; 
import { Button } from "./ui/button"
import Image from 'next/image';
import { EvalItem } from '@/src/types/evalItem';
import {
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"

import OpenGraphCardMetaData from '@/src/components/OpenGraphCardMetaData';
import { Share2Icon, TwitterLogoIcon } from '@radix-ui/react-icons';

interface ShareCardInterfaceProps {
  evalItem: EvalItem;
}

const ShareCardInterface: React.FC<ShareCardInterfaceProps> = ({ evalItem }) => {
  const { title, description, url, image } = OpenGraphCardMetaData(evalItem);
  if (!title || !description || !url || !image) {
    console.log('???????')
    return null;
  }
  return (
      <div
      className="w-1/3 ml-auto mr-5"
      >
      <Popover>
        <PopoverTrigger asChild={true}>
          <Button variant="ghost" id="share-card-button" className="w-21 h-7 rounded-bl-none rounded-tl-none rounded-br-none" aria-label="Search on the eval"><span className="mr-2"><Share2Icon /></span>
          </Button>
        </PopoverTrigger>
        <PopoverContent id="share-card-popover" className="mr-2 float-center w-[350px] md:w-[900px] md:mr-5 rounded-md">
            <CardHeader>
              <CardTitle>Share Card</CardTitle>
            <CardDescription>This card can be shared through <a className="underline" href="https://ogp.me/" target="_blank" rel="noopener noreferrer">Open Graph protocol</a>.<br></br>              
              </CardDescription>
            </CardHeader>
            <CardContent>
          <div className="flex flex-col">
              <h3 className="text-lg font-semibold">Twitter</h3>
              
                <Button variant="outline"
                className="flex w-20 items-center justify-center mb-1 p-0"
                >
                <a href={`https://twitter.com/intent/tweet?text=A%20search%20eval%20for%20[${evalItem.query}]%20${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TwitterLogoIcon className="inline w-4 h-4"/>
                    <span className="ml-1">Tweet</span>
                  </a>
              </Button>
              </div>
              Rough example of the sharecard:
          <div className="flex flex-col items-center border-2 rounded-md justify-center w-2/3 p-4">
            <Image src={`/screenshots/card-${evalItem.id}.png`} alt="Open Graph Image" width={500} height={300} className="object-cover rounded-lg mb-4" />
            <h3 className="text-md font-semibold">{title}</h3>
          </div>
              
          </CardContent>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ShareCardInterface; // Export the component at the end
