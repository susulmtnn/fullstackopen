
  const Header = ({ course }) => {
    return <h1>{course}</h1>
  }

  const Content = ({ parts }) => {
    return (
      <div>
        <p>{parts[0].name} {parts[0].exercises}</p>
        <p>{parts[1].name} {parts[1].exercises}</p>
        <p>{parts[2].name} {parts[2].exercises}</p> 
      </div>
    )
  }

  const Total = ({ parts }) => {
    const total = parts[0].exercises + parts[1].exercises + parts[2].exercises
    return <p>Number of exercises {total}</p>
  }

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14
  const parts = [
    { name: part1, exercises: exercises1 },
    { name: part2, exercises: exercises2 },
    { name: part3, exercises: exercises3 }
  ]


  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

export default App