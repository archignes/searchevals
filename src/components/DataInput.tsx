import React, { useContext } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import DataContext, { evalPart, System } from './DataContext';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import copy from 'copy-to-clipboard';
import { Button } from "./ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"


// Define Zod schema based on the EvalItem interface
const evalPersonSchema = z.object({
  name: z.string(),
  role: z.string(),
});

const evalPartSchema = z.object({
  id: z.string(),
  content: z.string(),
  images: z.array(z.string()).optional(),
});

const evalsystemschema = z.object({
  id: z.string().transform((val) => val.toLowerCase()),
  date: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: "Date must be in YYYY-MM-DD format",
  }),
  query: z.string(),
  url: z.string().url(),
  context: z.string().optional(),
  systems: z.array(z.string()).optional(),
  eval_parts: z.array(evalPartSchema).optional(),
  content: z.string().optional(),
  images: z.array(z.string()).optional(),
  person: evalPersonSchema.optional(),
});

export function EvalForm() {
  const { data, systems, persons } = useContext(DataContext); // Destructure data from DataContext

  const form = useForm<z.infer<typeof evalsystemschema>>({
    resolver: zodResolver(evalsystemschema),
    defaultValues: {},
  })

  function onSubmit(values: z.infer<typeof evalsystemschema>) {
    copy(JSON.stringify(values, null, 2));
    alert("Evaluation data copied to clipboard!");
    console.log(values)
  }

  return (
    <div className="w-2/3 mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          {/* ID Field */}
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>eval.id</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      // Transform the value to lowercase and replace spaces with hyphens before setting it
                      const transformedValue = e.target.value.toLowerCase().replace(/\s+/g, '-');
                      field.onChange(transformedValue); // Update the form with the transformed value
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Unique identifier for the evaluation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Date Field */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormDescription>
                  Date of the evaluation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Query Field */}
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Query</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  The query evaluated.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* URL Field */}
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  URL source of the evaluation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Context Field (Optional) */}
          <FormField
            control={form.control}
            name="context"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Context</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Additional context for the evaluation (optional).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {systems.map((system) => (
            <FormField
              key={system.id}
              control={form.control}
              name="systems"
              render={({ field }) => {
                return (
                  <FormItem
                    key={system.id}
                    className="flex flex-row systems-start items-center space-x-1 space-y-1"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(system.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...(field.value || []), system.id])
                            : field.onChange(
                              (field.value || []).filter(
                                (value) => value !== system.id
                              )
                            )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">{system.name}</FormLabel>
                  </FormItem>
                )
              }}
          />)) }
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}