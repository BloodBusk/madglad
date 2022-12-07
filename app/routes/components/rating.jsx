import React from 'react'

import star from "~/imgs/star.svg"

export default function Rating({rating}) {
    rating = 1;
  return (
    <div>
        <img src={star} alt="star" />
    </div>
  )
}
