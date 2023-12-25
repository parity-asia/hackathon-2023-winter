import { HTMLProps } from 'react'

export default function Loading(
  props: Omit<HTMLProps<SVGSVGElement>, 'crossOrigin'>
) {
  return (
    <svg
      {...props}
      style={{
        margin: 'auto',
        display: 'block',
        shapeRendering: 'auto',
        ...props.style,
      }}
      width='1em'
      height='1em'
      viewBox='0 0 100 100'
      preserveAspectRatio='xMidYMid'
    >
      <circle
        cx='50'
        cy='50'
        r='32'
        strokeWidth='5'
        stroke='currentColor'
        strokeDasharray='50.26548245743669 50.26548245743669'
        fill='none'
        strokeLinecap='round'
      >
        <animateTransform
          attributeName='transform'
          type='rotate'
          repeatCount='indefinite'
          dur='2s'
          keyTimes='0;1'
          values='0 50 50;360 50 50'
        ></animateTransform>
      </circle>
    </svg>
  )
}
