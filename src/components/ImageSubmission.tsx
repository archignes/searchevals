import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  FormDescription,
  FormLabel,
} from "./ui/form";
import { Input } from "./ui/input"; // Assuming Checkbox is a component you have for boolean inputs
import { Checkbox } from './ui/checkbox';
import { Button } from "./ui/button";
import { imageItem } from './DataContext';

const ImageUploadField = () => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
  });

  React.useEffect(() => {
    if (fields.length === 0) {
      append({ url: '', caption: '', annotation: false }); // Updated to match the new data structure
    }
  }, [append, fields.length]);

  return (
    <div>
      <FormLabel>Images</FormLabel>
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col"> {/* Adjusted for better layout with multiple inputs */}
          <Input className="border" placeholder="Image URL" {...register(`images.${index}.url` as const)} />
          <Input className="border mt-2" placeholder="Caption (optional)" {...register(`images.${index}.caption` as const)} />
          <Checkbox className="mt-2" {...register(`images.${index}.annotation` as const)} />Annotation
          <Button type="button" onClick={() => remove(index)} className="text-xs py-1 mt-2 px-2">Remove</Button>
        </div>
      ))}
      <Button className="text-xs py-1 mt-2 px-2" type="button" onClick={() => append({ url: '', caption: '', annotation: false } as imageItem)}>Add another image</Button>
      <FormDescription>
        Images in the evaluation. Use the URLs of the images. Click "Add another image" to include more than one.
      </FormDescription>
    </div>
  );
};

export default ImageUploadField;