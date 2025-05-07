import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async () => {
  const juiz = {
    _id: "949c3984-5e0f-53a7-832c-1175e6389007",
    name: "Katia Itzel Garcia Mendoza",
    image_url: null,
    country: null,
    average_yellow_cards: 3.75,
    average_red_cards: 0.0833,
    average_fouls: 22,
    num_var_inc_idents: 3
  };

  const data = Array(5).fill(juiz);
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
