/**
 * @jest-environment jsdom
 */


 import '@testing-library/jest-dom'
 import BillsUI from "../views/BillsUI.js"

 import { bills } from "../fixtures/bills.js"
 import userEvent from '@testing-library/user-event'
 import Bills from "../containers/Bills.js"
 import { localStorageMock } from "../__mocks__/localStorage.js"
 import { fireEvent, getByTestId, screen } from "@testing-library/dom"
 import NewBillUI from "../views/NewBillUI.js"
 import NewBill from "../containers/NewBill.js"
 import { ROUTES, ROUTES_PATH } from "../constants/routes"



describe("Given I am connected as an employee and i'm on the page 'New Bill'", () => {
  describe("When I do not fill fields and I click on envoyer button", () => {
    test("It should not navigate to another page", () => {

      const pathname = ROUTES_PATH['NewBill']
      const html = ROUTES({
        pathname
       })
       document.body.innerHTML = html
       expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()


      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
       const store = null


      expect(screen.getByTestId("form-new-bill")).toBeTruthy();

      const inputDate = screen.getByTestId("datepicker");
      // fireEvent.change(inputDate, { target: { value: "2022-02-22" } });
      expect(inputDate.value).toBe("");

      const inputAmount = screen.getByTestId("amount");
      fireEvent.change(inputAmount, { target: { value: "654" } });
      expect(inputAmount.value).toBe("654");

      const inputVat = screen.getByTestId("vat");
      expect(inputVat.value).toBe("");

      const inputPct = screen.getByTestId("pct");
      expect(inputPct.value).toBe("");

      const inputFile = screen.getByTestId("file");
      expect(inputFile.value).toBe("");

    const myNewBill = new NewBill({
      document, onNavigate, store, localStorage: window.localStorage
    })

    const handleSubmit = jest.fn((e) => myNewBill.handleSubmit(e))
 
    const form = screen.getByTestId("form-new-bill");
    form.addEventListener("submit", handleSubmit);
    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalled()
    expect(screen.getByText("Mes notes de frais")).toBeTruthy();

    })
  })

  describe("When I select the wrong file", () => {
    test("File field value must be empty", async () => {
      
      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const myNewBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })


      const str = JSON.stringify('derwer');
      const blob = new Blob([str]);


      const file = new File([blob], 'values.json', {
        type: 'application/JSON',
      });
      File.prototype.text = jest.fn().mockResolvedValueOnce(str);
      let filePath = '/'
      let fileName = 'file.xml'

      const inputFile = screen.getByTestId('file' );
      const handleChangeFile = jest.fn((e) => myNewBill.handleChangeFile(e, file, filePath, fileName))

      inputFile.addEventListener("upload", handleChangeFile);
      // fireEvent.upload(inputFile, file);

      fireEvent.change(inputFile, {
        target: {
          file,
        },
      })

      let image = document.getElementById("file");

      // inputFile.addEventListener('upload')

      
     

    })
  })



})
