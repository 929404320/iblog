// Copyright (c) poetize.cn. All rights reserved.
// 习近平：全面加强知识产权保护工作 激发创新活力推动构建新发展格局
// 项目开源版本使用AGPL v3协议，商业活动除非获得商业授权，否则无论以何种方式修改或者使用代码，都需要开源。地址：https://gitee.com/littledokey/poetize.git
// 开源不等于免费，请尊重作者劳动成果。
// 项目闭源版本及资料禁止任何未获得商业授权的网络传播和商业活动。地址：https://poetize.cn/article/20
// 项目唯一官网：https://poetize.cn

package com.ld.poetry.utils.mail;

import com.ld.poetry.constants.CommonConst;
import com.ld.poetry.entity.*;
import com.ld.poetry.enums.CommentTypeEnum;
import com.ld.poetry.im.http.entity.ImChatUserMessage;
import com.ld.poetry.service.CommentService;
import com.ld.poetry.utils.CommonQuery;
import com.ld.poetry.utils.PoetryUtil;
import com.ld.poetry.utils.cache.PoetryCache;
import com.ld.poetry.vo.CommentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class MailSendUtil {

    @Autowired
    private CommonQuery commonQuery;

    @Autowired
    private MailUtil mailUtil;

    public void sendCommentMail(CommentVO commentVO, Article one, WeiYan yan, CommentService commentService) {
        List<String> mail = new ArrayList<>();
        String toName = "";
        if (commentVO.getParentUserId() != null) {
            User user = commonQuery.getUser(commentVO.getParentUserId());
            if (user != null && !user.getId().equals(PoetryUtil.getUserId()) && StringUtils.hasText(user.getEmail())) {
                toName = user.getUsername();
                mail.add(user.getEmail());
            }
        } else {
            if (CommentTypeEnum.COMMENT_TYPE_MESSAGE.getCode().equals(commentVO.getType()) ||
                    CommentTypeEnum.COMMENT_TYPE_LOVE.getCode().equals(commentVO.getType())) {
                User adminUser = PoetryUtil.getAdminUser();
                if (StringUtils.hasText(adminUser.getEmail()) && !Objects.equals(PoetryUtil.getUserId(), adminUser.getId())) {
                    mail.add(adminUser.getEmail());
                }
            } else if (CommentTypeEnum.COMMENT_TYPE_ARTICLE.getCode().equals(commentVO.getType())) {
                User user = commonQuery.getUser(one.getUserId());
                if (user != null && StringUtils.hasText(user.getEmail()) && !user.getId().equals(PoetryUtil.getUserId())) {
                    mail.add(user.getEmail());
                }
            } else if (CommentTypeEnum.COMMENT_TYPE_JOTTING.getCode().equals(commentVO.getType())) {
                User user = commonQuery.getUser(yan.getUserId());
                if (user != null && StringUtils.hasText(user.getEmail()) && !user.getId().equals(PoetryUtil.getUserId())) {
                    mail.add(user.getEmail());
                }
            }
        }

        if (!CollectionUtils.isEmpty(mail)) {
            String sourceName = "";
            if (CommentTypeEnum.COMMENT_TYPE_ARTICLE.getCode().equals(commentVO.getType())) {
                sourceName = one.getArticleTitle();
            }
            String commentMail = getCommentMail(commentVO.getType(), sourceName,
                    PoetryUtil.getUsername(),
                    commentVO.getCommentContent(),
                    toName,
                    commentVO.getParentCommentId(), commentService);

            AtomicInteger count = (AtomicInteger) PoetryCache.get(CommonConst.COMMENT_IM_MAIL + mail.get(0));
            if (count == null || count.get() < CommonConst.COMMENT_IM_MAIL_COUNT) {
                WebInfo webInfo = (WebInfo) PoetryCache.get(CommonConst.WEB_INFO);
                mailUtil.sendMailMessage(mail, "您有一封来自" + (webInfo == null ? "POETIZE" : webInfo.getWebName()) + "的回执！", commentMail);
                if (count == null) {
                    PoetryCache.put(CommonConst.COMMENT_IM_MAIL + mail.get(0), new AtomicInteger(1), CommonConst.CODE_EXPIRE);
                } else {
                    count.incrementAndGet();
                }
            }
        }
    }

    /**
     * source：0留言 其他是文章标题
     * fromName：评论人
     * toName：被评论人
     */
    private String getCommentMail(String commentType, String source, String fromName, String fromContent, String toName, Integer toCommentId, CommentService commentService) {
        WebInfo webInfo = (WebInfo) PoetryCache.get(CommonConst.WEB_INFO);
        String webName = (webInfo == null ? "POETIZE" : webInfo.getWebName());

        String mailType = "";
        String toMail = "";
        if (StringUtils.hasText(toName)) {
            mailType = String.format(MailUtil.replyMail, fromName);
            Comment toComment = commentService.lambdaQuery().select(Comment::getCommentContent).eq(Comment::getId, toCommentId).one();
            if (toComment != null) {
                toMail = String.format(MailUtil.originalText, toName, toComment.getCommentContent());
            }
        } else {
            if (CommentTypeEnum.COMMENT_TYPE_MESSAGE.getCode().equals(commentType)) {
                mailType = String.format(MailUtil.messageMail, fromName);
            } else if (CommentTypeEnum.COMMENT_TYPE_ARTICLE.getCode().equals(commentType)) {
                mailType = String.format(MailUtil.commentMail, source, fromName);
            } else if (CommentTypeEnum.COMMENT_TYPE_LOVE.getCode().equals(commentType)) {
                mailType = String.format(MailUtil.loveMail, fromName);
            } else if (CommentTypeEnum.COMMENT_TYPE_JOTTING.getCode().equals(commentType)) {
                mailType = String.format(MailUtil.jottingMail, fromName);
            }
        }

        return String.format(mailUtil.getMailText(),
                webName,
                mailType,
                fromName,
                fromContent,
                toMail,
                webName);
    }

    public void sendImMail(ImChatUserMessage message) {
        if (!message.getMessageStatus()) {
            List<String> mail = new ArrayList<>();
            String username = "";
            User toUser = commonQuery.getUser(message.getToId());
            if (toUser != null && StringUtils.hasText(toUser.getEmail())) {
                mail.add(toUser.getEmail());
            }
            User fromUser = commonQuery.getUser(message.getFromId());
            if (fromUser != null) {
                username = fromUser.getUsername();
            }

            if (!CollectionUtils.isEmpty(mail)) {
                String commentMail = getImMail(username, message.getContent());

                AtomicInteger count = (AtomicInteger) PoetryCache.get(CommonConst.COMMENT_IM_MAIL + mail.get(0));
                if (count == null || count.get() < CommonConst.COMMENT_IM_MAIL_COUNT) {
                    WebInfo webInfo = (WebInfo) PoetryCache.get(CommonConst.WEB_INFO);
                    mailUtil.sendMailMessage(mail, "您有一封来自" + (webInfo == null ? "POETIZE" : webInfo.getWebName()) + "的回执！", commentMail);
                    if (count == null) {
                        PoetryCache.put(CommonConst.COMMENT_IM_MAIL + mail.get(0), new AtomicInteger(1), CommonConst.CODE_EXPIRE);
                    } else {
                        count.incrementAndGet();
                    }
                }
            }
        }
    }

    private String getImMail(String fromName, String fromContent) {
        WebInfo webInfo = (WebInfo) PoetryCache.get(CommonConst.WEB_INFO);
        String webName = (webInfo == null ? "POETIZE" : webInfo.getWebName());

        return String.format(mailUtil.getMailText(),
                webName,
                String.format(MailUtil.imMail, fromName),
                fromName,
                fromContent,
                "",
                webName);
    }
}
