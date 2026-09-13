const Notification = ({ notification }) => {
  if (notification === null) return null

  return (
    <div className={`notification ${notification.type}`} role="status">
      {notification.message}
    </div>
  )
}

export default Notification
