$(function() {
  $('.content').first().slideDown();

  $('ul.link-wapper li a').on("click",function (event) { 
    var current_tab = $(this);
    $('ul.link-wapper li a').removeClass('active');
    current_tab.addClass('active');

    $('.content').slideUp();
    current_tab_href = current_tab.attr('href'); // #home
    $(current_tab_href).slideDown(); // $('#home')

    event.preventDefault();
  })

  $('.addtocart').on("click",function (param) { 
    let id = $(this).data('id');
    let name = $(this).data('name');
    let price = $(this).data('price');
    let item = {
        id: id,
        name: name,
        price: price,
        qty: 1
    }
    // console.log(item)

    let cart = localStorage.getItem('cart');
    let myArr = '';

    if(cart != null){
        myArr = JSON.parse(cart);
    }else{
        myArr = []
    }

    // homework
    let status=0;
    for(row of myArr){ // 1,2
        if(row.id == id){ // 3
            row.qty++;
            status = 1;
        }
    } 

    if(status == 0){
        myArr.push(item)
    }

    // JS Object => JSON String
    let myArrString = JSON.stringify(myArr);
    // console.log(myArrString)

    localStorage.setItem('cart',myArrString);
    showcartnoti();
    getdata();

    Swal.fire({
      // position: 'top-end',
      icon: 'success',
      title: 'New Item added into the cart!',
      showConfirmButton: false,
      timer: 2000
    })
  })

  // Get Data From LS
  function getdata() { 
    let cart = localStorage.getItem('cart');
    if(cart != null){
        let myArr = JSON.parse(cart);
        let row = ''
        let total = 0;
        let i = 0;
        for([index,item] of myArr.entries()){
            total += (item.qty*item.price);
            row += `<tr>
                    <td>
                        <button class="remove" data-id="${index}">Remove</button> 
                        ${++i}
                    </td>
                    <td>${item.name}</td>
                    <td>${item.price}</td>
                    <td>
                        <input type="number" min="1" value="${item.qty}" data-id="${index}" class="updateqty">
                    </td>
                    <td>${item.qty*item.price} Ks</td>
                </tr>`
        }

        row += `<tr>
                    <td colspan="4">Total Amount</td>
                    <td>${total} Ks</td>
                </tr>`

        $('tbody').html(row)
    }else{
        $('tbody').html(`<tr><td colspan="5">Your Cart is empty!</td></tr>`);
    }
  }
  getdata();

  // Remove 
  $('tbody').on("click",".remove",function () { 
    let index = $(this).data('id');
    // console.log(index)
    let cart = localStorage.getItem('cart');
    let myArr = JSON.parse(cart);
    // Delete one row
    myArr.splice(index,1)
    // JS Object => JSON String
    let myArrString = JSON.stringify(myArr);
    // console.log(myArrString)
    localStorage.setItem('cart',myArrString);
    showcartnoti();
    getdata();
  })

  // increase - decrease Qty
  $('tbody').on("change",".updateqty",function () { 
    let index = $(this).data('id');
    // console.log(index)
    let qty = $(this).val();
    let cart = localStorage.getItem('cart');
    let myArr = JSON.parse(cart);
    myArr[index].qty = Number(qty)
    // JS Object => JSON String
    let myArrString = JSON.stringify(myArr);
    // console.log(myArrString)
    localStorage.setItem('cart',myArrString);
    showcartnoti();
    getdata();
  })

  // checkout
  $('.checkout').on("click",function () {
    Swal.fire({
      title: 'Are you sure to checkout?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, do it!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('cart')
        // server request

        showcartnoti();
        getdata();
        Swal.fire(
          'Success!',
          'Your order has been successfully completed.',
          'success'
        )
      }
    })
  })

  function showcartnoti() { 
    let cart = localStorage.getItem('cart');
    if(cart != null){
      let myArr = JSON.parse(cart);
      let count = myArr.reduce((total,row) => total+row.qty,0)
      $('.noti').html(`(${count})`)
    }else{
      $('.noti').html(``)
    }
  }

  showcartnoti();
})
