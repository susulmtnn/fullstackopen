
  const Header = ({ course }) => {
    return <h1>{course}</h1>
  }
// This component is now not really useful because we created the partslist so I removed it.
  // const Part = ({ part }) => {
  //   return <p>{part.name} {part.exercises}</p>
  // }

  const Content = ({ parts }) => {
    const contentParts = parts.map(part => <p>{part.name} {part.exercises}</p>)
    return (
      <div>
        {contentParts}
      </div>
    )
  }

  const Total = ({ parts }) => {
    const total = parts[0].exercises + parts[1].exercises + parts[2].exercises
    return <p>Number of exercises {total}</p>
  }

const App = () => {
  const course = 'Half Stack application development'
  const parts_list = [{
    name: 'Fundamentals of React',
    exercises: 10
  },
  {
    name: 'Using props to pass data',
    exercises: 7
  },
  {
    name: 'State of a component',
    exercises: 14
  }]



  return (
    <div>
      <Header course={course} />
      <Content parts={parts_list} />
      <Total parts={parts_list} />
    </div>
  )
}



export default App