import axios from 'axios';
import AWS from 'aws-sdk';

AWS.config.update({ region: 'us-east-1' });

const SNS = new AWS.SNS({ apiVersion: '2010-03-31' });

const publishSNS = async (message) => {
  try {
    // Create publish parameters
    var params = {
      Message: message /* required */,
      TopicArn: 'arn:aws:sns:us-east-1:380915434045:Topic_Alerta_Site',
    };

    // Create promise and SNS service object
    await SNS.publish(params).promise();

    console.log(
      `Message ${params.Message} sent to the topic ${params.TopicArn}`
    );
  } catch (error) {
    throw error;
  }
};

export const handler = async (event) => {
  try {
    const { status } = await axios.get(event.url);

    if (status !== 200) {
      throw new Error('Site is not OK');
    }

    return {
      statusCode: status,
      message: 'Site is OK!',
    };
  } catch (error) {
    const { stack, message } = error;

    await publishSNS(error.message);

    return {
      message,
      stack,
    };
  }
};
