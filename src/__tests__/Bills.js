/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import BillsUI from "../views/BillsUI.js"

import {getByRole, getByTestId} from '@testing-library/dom'
import { screen } from "@testing-library/dom"

// import VerticalLayout from './VerticalLayout.js'
import { bills } from "../fixtures/bills.js"

// import { ROUTES, ROUTES_PATH } from "../constants/routes.js"

import userEvent from '@testing-library/user-event'

import Bills from "../containers/Bills.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      const eye = screen.getAllByTestId('icon-eye')
      //to-do write expect expression
      // let pathname = ROUTES_PATH['Bills']

      // document.body.innerHTML = html
    //  expect(screen.getByTestId('icon-window')).toHaveClass('active-icon')

    


    })

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

   
    
  })
  
})
