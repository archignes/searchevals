import React from 'react';
import EvalInputForm from './AddEvalForm'
import EvaluatorInputForm from './AddEvaluatorForm'
import SystemInputForm from './AddSystemForm'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from './ui/card';

export function NewInputForm() {
  return (
    <div className="w-2/3 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Validate and Format Inputs</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="eval_input" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="eval_input">Add Eval</TabsTrigger>
              <TabsTrigger value="evaluator_input">Add Evaluator</TabsTrigger>
              <TabsTrigger value="system_input">Add System</TabsTrigger>
          </TabsList>
            <TabsContent value="eval_input">
              <EvalInputForm/>
          </TabsContent>
            <TabsContent value="evaluator_input">
              <EvaluatorInputForm/>
          </TabsContent>
            <TabsContent value="system_input">
              <SystemInputForm/>
            </TabsContent>
        </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}