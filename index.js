import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

let likeBtn = false;
let retweetBtn = false;

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  }
});

function handleLikeClick(tweetID) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetID;
  })[0];
  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  likeBtn = !likeBtn;
  render();
}

function handleRetweetClick(tweetID) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetID;
  })[0];
  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  retweetBtn = !retweetBtn;
  render();
}

function handleReplyClick(tweetID) {
  const replyIcon = document.getElementById(`replies-${tweetID}`);
  replyIcon.classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");
  const newTweet = {
    handle: "@Scrimba",
    profilePic: "images/scrimbalogo.png",
    likes: 0,
    retweets: 0,
    tweetText: tweetInput.value,
    replies: [],
    isLiked: false,
    isRetweeted: false,
    uuid: uuidv4(),
  };

  if (newTweet.tweetText !== "") {
    tweetsData.unshift(newTweet);
    tweetInput.value = "";
    render();
  }
}

function getFeedHTML() {
  let feedHTML = ``;

  tweetsData.forEach(function (tweet) {
    let likedClass = "";
    let retweetClass = "";
    let repliesHtml = "";

    if (tweet.isLiked) {
      likedClass = "liked";
    }

    if (tweet.isRetweeted) {
      retweetClass = "retweeted";
    }

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
        <div class="tweet-reply">
          <div class="tweet-inner">
            <img src="${reply.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${reply.handle}</p>
                    <p class="tweet-text">${reply.tweetText}</p>
                </div>
            </div>
    </div>`;
      });
    }

    feedHTML += `<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                <i class="fa-regular fa-comment-dots" 
                data-reply="${tweet.uuid}"
                ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                <i class="fa-solid fa-heart ${likedClass}" 
                data-like="${tweet.uuid}"
                ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                <i class="fa-solid fa-retweet ${retweetClass}" 
                data-retweet="${tweet.uuid}"
                ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
    ${repliesHtml}
    </div> 
</div>`;
  });

  return feedHTML;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHTML();
}

render();
