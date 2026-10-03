import React, { useState } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { APP_IMAGES } from '../../assets/images';
import {
  Trophy,
  Users,
  Swords,
  Flame,
  MessageSquare,
  ThumbsUp,
  Share2,
  CheckCircle,
  Plus,
  Send,
  Watch,
  Award,
} from 'lucide-react';

export const SocialView: React.FC = () => {
  const {
    challenges,
    joinChallenge,
    duels,
    leaderboard,
    posts,
    createPost,
    toggleKudos,
    addComment,
    openShareModal,
    t,
  } = useFitness();

  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges' | 'duels' | 'feed'>('leaderboard');
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleSendPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    createPost(newPostContent.trim(), 'workout');
    setNewPostContent('');
  };

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    addComment(postId, text.trim());
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const top3 = leaderboard.slice(0, 3);
  const restUsers = leaderboard.slice(3);

  return (
    <div className="space-y-6">
      {/* Community Hero Banner */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 text-white overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 z-0">
          <img
            src={APP_IMAGES.communityChallenge}
            alt="Community Challenges"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl space-y-3">
          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            Global Athletic League & Friend Duels
          </span>

          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {t.communityLeaderboard}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Compete on verified wearable telemetry leaderboards, challenge friends to 1-on-1 step duels, and share milestone achievement cards.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => openShareModal()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-950/60"
            >
              <Share2 className="w-4 h-4" />
              <span>{t.shareProgress}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'leaderboard'
              ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Leaderboard Podium</span>
        </button>

        <button
          onClick={() => setActiveTab('challenges')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'challenges'
              ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>{t.challenges}</span>
        </button>

        <button
          onClick={() => setActiveTab('duels')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'duels'
              ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Swords className="w-3.5 h-3.5" />
          <span>{t.friendDuels}</span>
        </button>

        <button
          onClick={() => setActiveTab('feed')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'feed'
              ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{t.socialFeed}</span>
        </button>
      </div>

      {/* Tab Content 1: Leaderboard Podium */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {/* Rank 2 (Silver) */}
            <div className="order-2 md:order-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm text-center flex flex-col items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold font-mono text-xs flex items-center justify-center mb-2">
                2
              </span>
              <img
                src={top3[1]?.avatar}
                alt={top3[1]?.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-300 dark:border-slate-700"
              />
              <div className="mt-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{top3[1]?.name}</h4>
                <span className="text-[11px] text-slate-400">{top3[1]?.brand}</span>
              </div>
              <div className="mt-3 p-2 w-full rounded-xl bg-slate-50 dark:bg-slate-950/60 font-mono">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {top3[1]?.score.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block uppercase">Weekly Steps</span>
              </div>
            </div>

            {/* Rank 1 (Gold) */}
            <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900 border-2 border-amber-400/60 rounded-2xl p-6 shadow-md text-center flex flex-col items-center justify-between scale-100 md:-translate-y-2">
              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs uppercase tracking-wider mb-2">
                <Trophy className="w-4 h-4 fill-current" />
                <span>Champion</span>
              </div>
              <img
                src={top3[0]?.avatar}
                alt={top3[0]?.name}
                className="w-20 h-20 rounded-full object-cover border-3 border-amber-400 shadow-lg shadow-amber-500/20"
              />
              <div className="mt-2">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{top3[0]?.name}</h4>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  {top3[0]?.brand} · {top3[0]?.streakDays}d Streak
                </span>
              </div>
              <div className="mt-4 p-3 w-full rounded-xl bg-amber-500/10 border border-amber-500/20 font-mono">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {top3[0]?.score.toLocaleString()}
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-300 block uppercase">
                  Weekly Steps
                </span>
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="order-3 md:order-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm text-center flex flex-col items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-amber-800/20 text-amber-800 dark:text-amber-500 font-bold font-mono text-xs flex items-center justify-center mb-2">
                3
              </span>
              <img
                src={top3[2]?.avatar}
                alt={top3[2]?.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-800/40"
              />
              <div className="mt-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{top3[2]?.name}</h4>
                <span className="text-[11px] text-slate-400">{top3[2]?.brand}</span>
              </div>
              <div className="mt-3 p-2 w-full rounded-xl bg-slate-50 dark:bg-slate-950/60 font-mono">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {top3[2]?.score.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block uppercase">Weekly Steps</span>
              </div>
            </div>
          </div>

          {/* Full Rankings Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Full Standings
            </h3>

            <div className="space-y-2">
              {leaderboard.map((user) => (
                <div
                  key={user.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    user.isCurrentUser
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs'
                      : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-bold font-mono text-xs text-slate-400">
                      #{user.rank}
                    </span>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        {user.name}
                        {user.isCurrentUser && (
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded font-semibold">
                            You
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-400">{user.brand}</p>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                      {user.score.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block uppercase">{user.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Challenges */}
      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {challenges.map((challenge) => {
            const percent = Math.min(100, Math.round((challenge.currentProgress / challenge.targetValue) * 100));
            return (
              <div
                key={challenge.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="uppercase font-mono tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                      {challenge.rewardBadge}
                    </span>
                    <span>
                      {challenge.daysRemaining} {t.daysRemaining}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {challenge.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {challenge.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Progress</span>
                      <strong className="text-slate-900 dark:text-white">
                        {challenge.currentProgress.toLocaleString()} / {challenge.targetValue.toLocaleString()} {challenge.unit} ({percent}%)
                      </strong>
                    </div>

                    <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">
                    {challenge.participantsCount.toLocaleString()} Athletes
                  </span>

                  {challenge.hasJoined ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      {t.joined}
                    </span>
                  ) : (
                    <button
                      onClick={() => joinChallenge(challenge.id)}
                      className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors cursor-pointer"
                    >
                      {t.joinChallenge}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab Content 3: 1-on-1 Friend Duels */}
      {activeTab === 'duels' && (
        <div className="space-y-4">
          {duels.map((duel) => {
            const userPercent = Math.min(100, Math.round((duel.userScore / duel.target) * 100));
            const friendPercent = Math.min(100, Math.round((duel.friendScore / duel.target) * 100));
            const isUserWinning = duel.userScore >= duel.friendScore;

            return (
              <div
                key={duel.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Swords className="w-4 h-4 text-rose-500" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      1-on-1 Duel: {duel.metricName}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{duel.daysRemaining}d left</span>
                </div>

                {/* Head-to-Head Comparison Bar */}
                <div className="grid grid-cols-2 gap-4 items-center">
                  {/* You */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900 dark:text-white">You</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {duel.userScore.toLocaleString()} {duel.unit}
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${userPercent}%` }}
                        className="h-full rounded-full bg-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Friend */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900 dark:text-white">{duel.friendName}</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                        {duel.friendScore.toLocaleString()} {duel.unit}
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${friendPercent}%` }}
                        className="h-full rounded-full bg-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2">
                  <span>
                    Status:{' '}
                    <strong className={isUserWinning ? 'text-emerald-500' : 'text-amber-500'}>
                      {isUserWinning ? 'You are leading!' : `${duel.friendName} is ahead!`}
                    </strong>
                  </span>

                  <button
                    onClick={() => openShareModal({ title: `Duel with ${duel.friendName}`, calories: duel.userScore })}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Duel</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab Content 4: Athletic Social Feed */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Create Post Box */}
          <form
            onSubmit={handleSendPost}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
          >
            <textarea
              rows={2}
              placeholder="Share a workout update, PR, or training takeaway..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => openShareModal()}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Attach Performance Card</span>
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-sm"
              >
                Post Update
              </button>
            </div>
          </form>

          {/* Feed Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
              >
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {post.authorName}
                      </h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Watch className="w-3 h-3 text-slate-400" />
                        {post.authorDevice} · {post.timestamp}
                      </p>
                    </div>
                  </div>

                  {post.statsBadge && (
                    <span className="text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/60">
                      {post.statsBadge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {post.content}
                </p>

                {/* Kudos & Comments bar */}
                <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                  <button
                    onClick={() => toggleKudos(post.id)}
                    className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                      post.hasKudos ? 'text-rose-500 font-semibold' : 'hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${post.hasKudos ? 'fill-current' : ''}`} />
                    <span>{post.kudosCount} {t.kudos}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.comments.length} Comments</span>
                  </div>
                </div>

                {/* Comments List */}
                {post.comments.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {post.comments.map((c) => (
                      <div
                        key={c.id}
                        className="text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300"
                      >
                        <strong className="text-slate-900 dark:text-white mr-1.5">{c.author}:</strong>
                        <span>{c.text}</span>
                        <span className="text-[10px] text-slate-400 ml-2 font-mono">{c.time}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Write an encouraging comment..."
                    value={commentInputs[post.id] || ''}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendComment(post.id);
                      }
                    }}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button
                    onClick={() => handleSendComment(post.id)}
                    className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
