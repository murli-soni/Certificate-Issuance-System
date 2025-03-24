import {render , screen} from "@testing-library/react"
import App from './App';
test("Test first",()=>{
  render(<App/>)
  const text = screen.getByText(/Learn React/i)
  expect(text).toBeInTheDocument();
})