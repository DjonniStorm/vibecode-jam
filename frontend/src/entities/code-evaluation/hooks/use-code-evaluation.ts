import { useMutation } from '@tanstack/react-query';
import { codeEvaluationApi } from '../api/code-evaluation-api';
import type { CodeEvaluationRequest } from '../model/types';

const useCodeEvaluation = () => {
  return useMutation({
    mutationFn: (data: CodeEvaluationRequest) => codeEvaluationApi.evaluateCode(data),
  });
};

export { useCodeEvaluation };
