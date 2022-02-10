/**
 * @jest-environment jsdom
 */


 import '@testing-library/jest-dom'

 import { localStorageMock } from "../__mocks__/localStorage.js"
 import { fireEvent, getByTestId, screen } from "@testing-library/dom"
 import NewBillUI from "../views/NewBillUI.js"
 import NewBill from "../containers/NewBill.js"
 import { ROUTES, ROUTES_PATH } from "../constants/routes"

import  {Store, ApiMock} from '../__mocks__/store2.js'

import  store from '../__mocks__/store3.js'



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

  beforeEach(()=>{
    const html = NewBillUI()
    document.body.innerHTML = html
  })

  describe("When I select the file", () => {
    test("And the file is wrong, then function handleChangeFile should be called and the file is not upload", async () => {
       const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      let store = new Store()

      // const store = null
      const myNewBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })
      const blob = new Blob(['text'], {type : 'image/txt'});
      const file = new File([blob], 'file.txt', { type: 'image/txt' });
      const inputFile = screen.getByTestId('file' );
      const handleChangeFile = jest.fn((e) => myNewBill.handleChangeFile(e))
      inputFile.addEventListener('change', handleChangeFile)
      fireEvent.change(inputFile, {
        target: {
          files: [file]
        },
      })
      const pauseFor = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
      await pauseFor(100);
      expect(handleChangeFile).toHaveBeenCalled()
      expect(myNewBill.type).toBe("unknown")
    })

    test("if the file was PNG, the file should upload", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      let store = new Store()
      const myNewBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })
      let obj = new Uint8Array([137, 80, 78, 71]); // magic byte for PNG (89 50 4E 47) in decimal number system
      const blob = new Blob([obj], {type : 'image/png'});
      const file = new File([blob], 'file.png', { type: 'image/png' });
      const inputFile = screen.getByTestId('file' );
      const handleChangeFile = jest.fn((e) => myNewBill.handleChangeFile(e))
      inputFile.addEventListener('change', handleChangeFile)
      fireEvent.change(inputFile, {
        target: {
          files: [file]
        },
      })
      const pauseFor = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
      await pauseFor(100);
      expect(myNewBill.type).toBe("image/png")
    })




  })
})

// test d'intégration POST
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to page 'Envoyer une note de frais'", () => {
    test("fetches bills from mock API POST", async () => {
       const getSpy = jest.spyOn(store, "post")
       const bills = await store.post()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
  })
})