const audioHandler = require('./audioHandler');
const textHandler = require('./textHandler');
const {
    platformReplyText,
    getPlatformToken,
    getImageId
} = require("./crossPlatformHandle");
const cloudClassifyingHandler = require('./cloudClassifyingHandle');

const handler = async context => {

    if (context.event.isFollow) {
        await platformReplyText(
            context,
            require('../message/followMsg')
        );
    } else if (context.event.isJoin) {
        await platformReplyText(
            context,
            require('../message/joinMsg')
        );
    } else if (context.event.isImage || context.event.isPhoto) {
        if (context.state.isGotReqWaitImg) {
            await cloudClassifyingHandler(context);
            // only ask if need to classify the photo when user
            // upload a photo in personal mode, otherwise we
            // ignore the photo.
        } else if (context.platform == "telegram" || !(context.event.rawEvent.source.type == 'room' ||
                context.event.rawEvent.source.type == 'group')) {
            context.setState({
                isGotImgWaitAns: true,
                isGotReqWaitImg: false,
                previousContext: {
                    platform: context.platform,
                    id: getImageId(context),
                    token: getPlatformToken(context.platform)
                }
            })
            await platformReplyText(
                context,
                require('../message/isImageMsg')
            );
        }
    } else if (context.event.isAudio) {
        await audioHandler(context);
    } else if (context.event.isText) {
        await textHandler(context, context.event.text);
    }
}

module.exports = handler;