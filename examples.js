import { supabase } from "./client.js";

// deleteAll wipes the DB for development purposes.
// All tables will cascade delete off of profile.
export async function _deleteAll() {
  return supabase.from("profile").delete().neq("id", 0);
}

// createProfile creates the profile and returns the id of the newly create profile.
export async function createProfile(username, email) {
  return supabase
    .from("profile")
    .insert({
      username,
      email,
    })
    .select()
    .throwOnError()
    .then(({ data }) => data[0]);
}

// createPost creates a post for the given profile id.
export async function createPost({ userId, title, description }) {
  return supabase
    .from("posts")
    .insert({
      title,
      description,
      profile_id: userId,
    })
    .select()
    .throwOnError()
    .then(({ data }) => data[0]);
}

export async function likePost(postId) {
  return supabase
    .rpc("increment_post_likes", { by: 1, row_id: postId })
    .throwOnError();
}

// mkFriends creates a junction entry for two profiles.
export async function mkFriends(userId1, userId2) {
  return Promise.all([
    supabase
      .from("friends")
      .insert({
        profile1_id: userId1,
        profile2_id: userId2,
      })
      .throwOnError(),
    supabase
      .from("friends")
      .insert({
        profile1_id: userId2,
        profile2_id: userId1,
      })
      .throwOnError(),
  ]);
}

export async function getFriends(userId) {
  return supabase
    .from("friends")
    .select(
      `
        profile2_id (
            id,
            username
        )
    `
    )
    .or(`profile1_id.eq.${userId}`)
    .throwOnError()
    .then(({ data }) => data.map(({ profile2_id }) => profile2_id));
}

// postFeed fetches top X most liked posts among a user's friends.
// This iterates over the return values instead of using an SQL efficient query;
// Alternatively, could be replaced with RPC call.
// See: https://github.com/supabase/postgrest-js/issues/198
export async function postFeed(userId, limit = 10) {
  return supabase
    .from("friends")
    .select(
      `
    profile2_id (
        id,
        username,
        posts ( title, description, likes )
      )
    `
    )
    .or(`profile1_id.eq.${userId}`)
    .throwOnError()
    .then(({ data }) => {
      return data
        .flatMap(({ profile2_id }) => profile2_id["posts"])
        .sort((a, b) => (a.likes < b.likes ? 1 : -1))
        .slice(0, limit);
    });
}

// TODO(akevinge): Add more queries.
