import React, { useEffect } from 'react';
import { useForm, useFieldArray, useFormContext } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input";
import { Checkbox } from './ui/checkbox';
import { Button } from "./ui/button";
import { imageItem } from '@/src/types/evalItem';

export const ImageUploadField = () => {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
  });

  const { trigger } = useForm();

  useEffect(() => {
    // Trigger validation when the form data changes
    trigger();
  }, [trigger, errors]);

  // React.useEffect(() => {
  //   if (fields.length === 0) {
  //     append({ url: '', alt: '' });
  //   }
  // }, [append, fields.length]);

  return (          
        <FormField
          control={control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex flex-col"> {/* Adjusted for better layout with multiple inputs */}
                    <Input className="border" placeholder="Image URL" {...register(`images.${index}.url` as const)} />
                    <Input className="border mt-2" placeholder="Caption (optional)" {...register(`images.${index}.caption` as const)} />
                    <Checkbox className="mt-2" {...register(`images.${index}.annotation` as const)} />Annotation
                    <Button type="button" onClick={() => remove(index)} className="text-xs py-1 mt-2 px-2">Remove</Button>
                  </div>
                ))}
                
                <Button className="text-xs py-1 mt-2 px-2" type="button" onClick={() => append({ url: '', caption: '', annotation: false } as imageItem)}>Add another image</Button>
                </>
              </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )
        }
      />
  )
};