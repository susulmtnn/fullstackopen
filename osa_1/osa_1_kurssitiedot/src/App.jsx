
  const Header = ({ course }) => {
    return <h1>{course}</h1>
  }

  const Part = ({ part }) => {
    return <p>{part.name} {part.exercises}</p>
  }

  const Content = ({ parts }) => {
    return (
      <div>
        <Part part={parts[0]} />
        <Part part={parts[1]} />
        <Part part={parts[2]} /> 
      </div>
    )
  }

  const Total = ({ parts }) => {
    const total = parts[0].exercises + parts[1].exercises + parts[2].exercises
    return <p>Number of exercises {total}</p>
  }

const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  const parts = [part1, part2, part3]


  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

// const App = () => {
//   const course = 'Half Stack application development'
//   const part1 = 'Fundamentals of React'
//   const exercises1 = 10
//   const part2 = 'Using props to pass data'
//   const exercises2 = 7
//   const part3 = 'State of a component'
//   const exercises3 = 14
//   const parts = [
//     { name: part1, exercises: exercises1 },
//     { name: part2, exercises: exercises2 },
//     { name: part3, exercises: exercises3 }
//   ]


//   return (
//     <div>
//       <Header course={course} />
//       <Content parts={parts} />
//       <Total parts={parts} />
//     </div>
//   )
// }


export default App