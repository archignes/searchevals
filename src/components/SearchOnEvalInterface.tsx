"use client"

import React, { useContext, useState, useEffect } from 'react'; 
import { isMobile } from 'react-device-detect';
import { ExclamationTriangleIcon, PersonIcon, MobileIcon } from "@radix-ui/react-icons"
import { ScrollArea } from "./ui/scroll-area"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"

import {
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from './ui/card';


import DataContext, { EvalItem } from './DataContext'; 
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"

// Define a type for your component's props
type SearchOnEvalInterfaceProps = {
  evalItem: EvalItem;
};

function openLink(url: URL) {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');

  console.log(newWindow)
}



const SearchOnEvalInterface: React.FC<SearchOnEvalInterfaceProps> = ({ evalItem }) => {
  const { systems } = useContext(DataContext);

  const encodedQuery = encodeURIComponent(evalItem.query).replace(/%20/g, '+');

  const FormSchema = z.object({
    systems: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      systems: [],
    },
  })

  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (selectAll) {
      form.setValue('systems', systems.filter(system => !system.nondistinct_url).map(system => system.id));
    } else {
      form.setValue('systems', []);
    }
  }, [selectAll, systems, form]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("searching...", data);
    console.log(data.systems);

    let SearchOnEvalLinks = data.systems.map((systemIdentifier) => {
      // Find the corresponding system object in the 'systems' array
      const systemObject = systems.find(system => system.id === systemIdentifier || system.name === systemIdentifier);
      
      if (!systemObject) {
        // If no corresponding system is found, return null
        return null;
      }

      // If systemObject is found, replace '%s' in the searchLink with the encodedQuery
      return systemObject.search_link.replace('%s', encodedQuery);
    });

    // Filter out any null values if a system wasn't found
    SearchOnEvalLinks = SearchOnEvalLinks.filter(link => link !== null);

    // Open each link in a new tab
    SearchOnEvalLinks.forEach((link) => {
      if (link) {
        openLink(new URL(link));
      }
    });
  }


  return (
      <div className="float-right">
      <Popover>
        <PopoverTrigger asChild={true}>
          <Button className="btn btn-outline-secondary" aria-label="Search on the eval">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="mr-2 w-[350px] md:w-[600px] md:mx-auto rounded-md">
            <CardHeader>
              <CardTitle>SearchOnEval</CardTitle>
            <CardDescription>Here you can search on the original eval query.<br></br>
                  <span className="font-bold">(a)</span> Click the individual search system
                  links below to search the eval query
                <br></br><span className="ml-10">or</span><br></br>
                <span className="font-bold">(b)</span> select
                  multiple systems and click the Search button at the bottom 
                  (you may have to click to change settings in your browser to allow popups)
              
                <span className="text-xs grid grid-cols-10"><span className="font-bold">bold</span><span className="col-span-8 ml-2">This system is a subject of the eval</span></span>
                <span className="text-xs grid grid-cols-10">
                <ExclamationTriangleIcon className="h-3 w-3 ml-2 inline-block align-start" /><span className="col-span-8 ml-2">does not support <a target="_blank" rel="noreferrer" className="underline" href="https://developer.mozilla.org/en-US/docs/Web/API/URL/search">URL-search</a> so you will have to copy and paste the query manually.</span>
                  </span>
                <span className="text-xs grid grid-cols-10">
                  <PersonIcon className="h-3 w-3 ml-2 inline-block align-start" /><span className="col-span-8 ml-2">requires an account</span>
                </span>
                {isMobile && (
                  <span className="text-xs grid grid-cols-10">                  
                    <MobileIcon className="h-3 w-3 ml-2 inline-block align-start" /><span className="col-span-8 ml-2">The mobile app is prioritized to open the link and has a bug. You can long press (iOS) and choose to open directly in your browser</span>
                  </span>
                )}
              
              </CardDescription>
            </CardHeader>
            <CardContent>
            <CardTitle className="font-normal">Search Systems</CardTitle>
            <hr></hr>
            <ScrollArea className="mt-1 h-[300px] md:h-[400px] w-[300px] md:w-full rounded-md">
          <div className="flex justify-between space-x-4">
            <div className="space-y-1">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="systems"
                    render={() => (
                      <FormItem>
                        <FormItem className="flex flex-row items-start justify-end space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={selectAll}
                              onCheckedChange={(checked) => {
                                if (typeof checked === 'boolean') {
                                  setSelectAll(checked);
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">Select All</FormLabel>
                        </FormItem>
                        {/* Grid container for systems */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {systems.filter(system => !system.nondistinct_url).map((system) => (
                            <FormField
                              key={system.id} // Ensure this is a unique and stable identifier
                              control={form.control}
                              name={`systems`} // Updated to ensure unique name for each system
                              render={({ field }) => (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(system.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, system.id])
                                          : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== system.id
                                            )
                                          )
                                      }}
                                    />
                                  </FormControl>
                                  <div>
                                  {evalItem.systems!.includes(system.name) || (system.base_url_for && evalItem.systems!.some(evalSystem => system.base_url_for?.includes(evalSystem))) ? (
                                    <a className="underline font-bold" target="_blank" rel="noopener noreferrer" href={system.search_link.replace('%s', encodedQuery)}>{system.name}</a>
                                  ) : (
                                    <FormLabel className="text-sm font-normal">
                                      <a className="underline" target="_blank" rel="noopener noreferrer" href={system.search_link.replace('%s', encodedQuery)}>{system.name}</a>
                                    </FormLabel>
                                    )}
                                  {system.search_link.includes('%s') ? null : (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger><ExclamationTriangleIcon className="h-3 w-3 ml-1 inline-block align-middle" /></TooltipTrigger>
                                        <TooltipContent>
                                            <p>This system does not support searching via <a target="_blank" rel="noopener noreferrer" className="underline" href="https://developer.mozilla.org/en-US/docs/Web/API/URL/search">URL search property</a>.</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                  {system.account_required && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger className="m-0"><PersonIcon className="h-3 w-3 ml-1 inline-block align-middle" /></TooltipTrigger>
                                        <TooltipContent>
                                          <p>This system requires an account.</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                    {isMobile && system.mobile_app_breaks_links_warning && (
                                    <MobileIcon className="h-3 w-3 ml-1 inline-block align-middle" />
                                    )}
                                  </div>
                                </FormItem>
                              )
                              }
                              />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Search</Button>
                </form>
              </Form>
            </div>
          </div>
          </ScrollArea>
          </CardContent>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default SearchOnEvalInterface; // Export the component at the end
