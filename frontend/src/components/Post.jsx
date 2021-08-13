import React from 'react';

function Post({ data }) {
  return (
    <div>
      {data.createdAt}
      <br />
      {data.text} <br />
      <br />
    </div>
  );
}

export default Post;
