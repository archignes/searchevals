import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const ImageUploadField = () => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
  });
  // To set a default, use append on component mount if fields are empty
  React.useEffect(() => {
    if (fields.length === 0) {
      append(''); // Append an empty object or your desired default value structure
    }
  }, [append, fields.length]);
  
  return (
    <div> {/* Use a div here for simplification */}
      <label>Images</label>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center"> {/* Use div instead of FormControl */}
            <Input className="border" {...register(`images.${index}` as const)} />
            <Button type="button" onClick={() => remove(index)} className="text-xs py-1 ml-2 px-2">Remove</Button>
        </div>
      ))}
      <Button className="text-xs py-1 mt-2 px-2" type="button" onClick={() => append('')}>Add another image</Button>
      <FormDescription>
        Images in the evaluation. Use the URLs of the images. Click "Add another image" to include more than one.
      </FormDescription>
    </div>
  );
};


export default ImageUploadField;
