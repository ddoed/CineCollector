import React, { useState } from 'react'

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, ...rest } = props

  // 빈 src나 유효하지 않은 src는 렌더링하지 않음
  if (!src || (typeof src === 'string' && src.trim() === '')) {
    return null
  }

  // 에러가 발생했을 때도 아무것도 렌더링하지 않음
  if (didError) {
    return null
  }

  return (
    <img 
      src={src} 
      alt="" 
      className={className} 
      style={style} 
      {...rest} 
      onError={handleError}
    />
  )
}
