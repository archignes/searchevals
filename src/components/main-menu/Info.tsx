// InfoCard.tsx

import React from 'react';

import {
  Card,
  CardContent,
  CardTitle,
} from '../ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs"
import { ScrollArea } from "../ui/scroll-area"

import AboutCard from "../cards/Info/About"
import UpdatesCard from "../cards/Info/Updates"



const InfoCard: React.FC = () => {
  
  return (
    <Card className='rounded-tl-none rounded-tr-md rounded-br-md rounded-bl-md bg-white shadow-none mx-auto'>
      <CardTitle className='text-left pl-2 py-1 mb-2'>Info</CardTitle>
      <CardContent className="p-0 flex justify-center items-center flex-col">
      </CardContent>
      {/* <div id="show-intro-modal-again" className="flex justify-center">
          <Button variant="outline" className="m-2 hover:bg-blue-100" onClick={() => setShowIntroModal(true)}>Click here to see the intro modal again.</Button>
          </div> */}
          
        <Tabs defaultValue="about" className="px-1 w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="mx-1 hover:bg-blue-100 data-[state=active]:cursor-default" value="about">About</TabsTrigger>
            <TabsTrigger className="mx-1 hover:bg-blue-100 data-[state=active]:cursor-default" value="updates">Updates</TabsTrigger>
          </TabsList>
          <ScrollArea style={{ height: `calc(100vh - 260px)` }} className="p-4">
          <TabsContent value="about">
            <AboutCard/>
          </TabsContent>
            <TabsContent value="updates">
              <UpdatesCard/>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
    </Card>
  );
};

export default InfoCard;