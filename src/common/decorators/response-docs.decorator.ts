import { applyDecorators, Type } from '@nestjs/common';
import { ApiProperty, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export class GeneralResponseDto {
  @ApiProperty()
  code: number;
  @ApiProperty()
  message: string;
  @ApiProperty()
  data: any;
}

const buildSchema = <TModel extends Type<any>>(
  customCode: number = 0,
  customMessage: string = 'string',
  model: TModel = undefined,
  modelType: 'object' | 'array', //could be array or object
) => {
  return {
    allOf: [
      { $ref: getSchemaPath(GeneralResponseDto) }, // Overwrite General Response
      {
        properties: {
          code: { example: customCode },
          message: { example: customMessage },
          data: model
            ? modelType === 'array'
              ? {
                  type: 'array',
                  items: { $ref: getSchemaPath(model) },
                }
              : { $ref: getSchemaPath(model) }
            : {},
        },
      },
    ],
  };
};

export const DocApiResponse = <TModel extends Type<any>>(
  status: number,
  description: string = '',
  customCode: number = 0,
  model: TModel = undefined,
  modelType: 'object' | 'array' = 'object',
) => {
  return applyDecorators(
    ApiResponse({
      status,
      description,
      schema: buildSchema(customCode, description, model, modelType),
    }),
  );
};
