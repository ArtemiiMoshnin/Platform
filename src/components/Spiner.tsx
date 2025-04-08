import React from 'react'
import { Spin, Flex } from 'antd'

const Spiner: React.FC = () => {
  return (
    <Flex style={{ height: '100vh' }} align="center" justify="center">
      <Spin size="large" />
    </Flex>
  )
}
export default Spiner
