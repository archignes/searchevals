import { z } from 'zod';
import evals from "src/data/evals.json";
import { EvalItem } from '@/src/types/evalItem';
import { System } from '@/src/components/DataContext';

const evalItemIdSchema = z.string().regex(
    /^[a-zA-Z0-9\-_]+$/,
    "EvalItem ID must be alphanumeric, including dashes and underscores"
);

const validateEvaluatorIdInTail = (evalItemId: string, evaluatorId: string) => {
    if (!evalItemId.endsWith(evaluatorId)) {
        throw new Error("Evaluator ID must be in the tail of the EvalItem ID");
    }
};

export const validateData = (data: EvalItem[], systems: System[]) => {
    try {
        const validatedData = evals.map(evalItem => {
            evalItemIdSchema.parse(evalItem.id);
            if (evalItem.evaluator_id) {
                validateEvaluatorIdInTail(evalItem.id, evalItem.evaluator_id);
            }
            return evalItem;
        });

        const invalidSystems = validatedData.flatMap(evalItem =>
            evalItem.systems.filter(systemId =>
                !systems.some(system => system.id === systemId)
            ).map(invalidId => ({ evalItemId: evalItem.id, invalidSystemId: invalidId }))
        );

        if (invalidSystems.length > 0) {
            throw new Error(`Validation failed: Some systems in the data do not match the available systems. Invalid systems found in evalItems: ${invalidSystems.map(is => `EvalItem ID: ${is.evalItemId}, Invalid System ID: ${is.invalidSystemId}`).join(', ')}`);
        }

        return validatedData;
    } catch (error) {
        if (error instanceof z.ZodError) {
            const failedItem = evals.find(evalItem =>
                !evalItemIdSchema.safeParse(evalItem.id).success
            );
            throw new Error(
                `Validation error in evalItemId: \`${failedItem?.id}\`. ` +
                `${error.errors.map(e => e.message).join(', ')}`
            );
        } else if (error instanceof Error && error.message === "Evaluator ID must be in the tail of the EvalItem ID") {
            const failedItem = evals.find(evalItem =>
                evalItem.evaluator_id && !evalItem.id.endsWith(evalItem.evaluator_id)
            );
            throw new Error(
                `Validation error in evalItemId: \`${failedItem?.id}\`. ` +
                `${error.message}`
            );
        } else if (error instanceof Error) {
            throw new Error(`Validation error: ${error.message}`);
        } else {
            throw new Error("An unknown error occurred during validation.");
        }
    }
};