const {
    getCloudClassification,
    CloudClassifyingException
} = require('../lib/getCloudClassification');
const {
    platformReplyText,
    getPlatformToken,
    getImageId
} = require("./crossPlatformHandle");
const parseCloudResult = require('../message/parseCloudResult')

async function cloudClassifyingHandle(context) {
    const requestBody = context.state.isGotReqWaitImg ? {
        platform: context.platform,
        id: getImageId(context),
        token: getPlatformToken(context.platform)
    } : context.state.previousContext;
    try {
        const result = await getCloudClassification(requestBody);
        context.resetState();
        await platformReplyText(context, parseCloudResult(result));
    } catch (err) {
        if (err === CloudClassifyingException.BodyError) {
            await platformReplyText(context, '不支援此平台');
        } else if (err === CloudClassifyingException.ClassifyError) {
            await platformReplyText(context, '分析照片失敗，只支援 jpg 格式，請重新上傳檔案');
        } else if (err === CloudClassifyingException.PoolLimitationError) {
            await platformReplyText(context, '分析服務達到上限，請稍後再試');
        } else {
            await platformReplyText(context, '未知錯誤，請重新嘗試');
        }
    }
}

module.exports = cloudClassifyingHandle;