var express=require("express");
var router=express.Router();
var query=require("./../../queries");
var con=require("./../../connection");
var url=require('url');
const { constants } = require("buffer");
const { start } = require("repl");
const { end } = require("./../../connection");



function checkLogin(session)
{
    if(session.user_id)
    return true;
    else
    return false;
}


const redirection = (req, res, next) => {
  if(!req.session.user_id) {
    res.redirect('/admin');

  }
  else{
    next();

  }
} 




// login process start 


router.post("/registeradmin",function(req,res)
{
   
    var sql=`SELECT * FROM admin_table WHERE password='${req.body.password}' AND ueremail='${req.body.ueremail}'`;
    con.query(sql,function(err,result)
    {
        if(result.length>0)
        {
        req.session.user_id=result[0].admin_table_id;
        // console.log(req.session);
        res.send(`
                    <Script>
                        alert("Login Success");
                        window.location.assign("/admin/home/");
                    </Script>
               `); 
       }
       else
       {
        res.send(`
                    <Script>
                        alert("Invalid Credintials");
                        window.location.assign("/admin/");
                    </Script>
               `); 
       }
    })
    
});

// login process end 


// router.post("/registeradmin",function(req,res)
// { 
//   console.log(req.body);
//     // var sql=query.create("user_tbl",req.body);
//     var sql=query.insert("admin_table",req.body);
//     con.query(sql,function(err,result)
//     {
//         res.send(`
//        <Script>
//           alert("Accout Created Successfully");
//           window.location.assign("admin/home.ejs");
//        </Script>
//     `);
// });
// });


router.get("/home",redirection,function(req,res)
{
res.render("admin/home.ejs");
});









router.get("/",(req,res)=>
{
    // res.render("admin/home.ejs");
    res.render("admin/login.ejs");
})

// navbar start 
router.get("/navbar",redirection,function(req,res)
{
  sql=query.select("navbar");
  con.query(sql,function(err,result)
  {
    data={'nav_data':result};
    res.render("admin/navbar.ejs",data);
     
  });
});

// save navbar 
router.post("/savenav",function(req,res)
{
  //  console.log(req.body);
   nav_img=req.files.aimg;
   img=new Date().getTime()+nav_img.name;
   nav_img.mv("public/uploads/"+img,function(err){console.log(err)});
   req.body.nav_img=img;

   nav_logo=req.files.nlogo;
   img1=new Date().getTime()+nav_logo.name;
   nav_logo.mv("public/uploads/"+img1,function(err){console.log(err)});
   req.body.nav_logo=img1;

    // sql=query.create("Navbar",req.body);
    sql=query.insert("Navbar",req.body);
    con.query(sql,function(err,result)
    {
      // console.log(result)
      res.send(`
                <script>
                 alert("Data Inserted Sucessfully");
                 window.location.assign("/admin/navbar/");
                </script>
              `);
    });

});
// save navbar end

// delete navbar start 
router.get("/delete_navbar",redirection,function(req,res)
{
  urlData=url.parse(req.url,true).query;
  sql=`DELETE FROM navbar WHERE Navbar_id=${urlData.Navbar_id}`;
  con.query(sql,function(err,result)
  {
    res.send(`
             <script>
                alert("Navbar Deleted Successfully");
                window.location.assign("/admin/navbar/");
             </script>
            `);
  });
});
// delete navbar end 

// update navbar start 
router.get("/edit_navbar",redirection,function(req,res)
{

  urlData=url.parse(req.url,true).query;
  var sql=`SELECT * FROM navbar WHERE Navbar_id=${urlData.Navbar_id}`;
  con.query(sql,function(err,result)
  {
    // console.log(err);
    // res.send(result);
    data={'old_nav':result[0]};
    res.render("admin/edit_nav.ejs",data);
  })
});
// update navbar end
// update navbar start 
router.post("/update_nav",function(req,res)
{
  // console.log(req.body);
 d=req.body;
 if(req.files)
 {
  nav_img=req.files.aimg;
   img=new Date().getTime()+nav_img.name;
   nav_img.mv("public/uploads/"+img,function(err){console.log(err)});
   req.body.nav_img=img;

   nav_logo=req.files.nlogo;
   img1=new Date().getTime()+nav_img.name;
   nav_logo.mv("public/uploads/"+img1,function(err){console.log(err)});
   req.body.nav_logo=img1;

   sql=`UPDATE navbar SET otime='${d.otime}',cnumber='${d.cnumber}',fhead='${d.fhead}',shead='${d.shead}',
   thead='${d.thead}',fohead='${d.fohead}',fihead='${d.fihead}',nav_img='${d.nav_img}',nav_logo='${d.nav_logo}' WHERE Navbar_id='${d.Navbar_id}'`;
 }
 else
 {
  sql=`UPDATE navbar SET otime='${d.otime}',cnumber='${d.cnumber}',fhead='${d.fhead}',shead='${d.shead}',
   thead='${d.thead}',fohead='${d.fohead}',fihead='${d.fihead}' WHERE Navbar_id='${d.Navbar_id}'`;
 }
//  res.send(sql);
con.query(sql,function(err,result)
{
 res.send(`
          <script>
            alert("Navbar Updated Successfully");
            window.location.assign("/admin/navbar/");
          </script>
       `)
});
});

// update navbar  
// navbar end


// Slider page start 
router.get("/slider",redirection,function(req,res)
{
  sql=query.select("home_slider");
  con.query(sql,function(err,result)
  {
    data={'sli_data':result};
    res.render("admin/slider.ejs",data);
  });
})

// save slider start 
router.post("/saveslider",function(req,res)
{
  sli_img=req.files.fsimg;
  img=new Date().getTime()+sli_img.name;
  sli_img.mv("public/uploads/"+img,function(err){console.log(err)});
  req.body.sli_img=img;

  sli_img1=req.files.ssimg;
  img1=new Date().getTime()+sli_img1.name;
  sli_img1.mv("public/uploads/"+img1,function(err){console.log(err)});
  req.body.sli_img1=img1;

  // sql=query.create("home_slider",req.body);
  sql=query.insert("home_slider",req.body);
  con.query(sql,function(err,result)
  {
    res.send(`
             <script>
               alert("Record Inserted Successfully");
               window.location.assign("/admin/slider");
             </script>
           `);
  });

});
// save slider end 

// delete slider start 
 router.get("/delete_slider",redirection,function(req,res)
 {
  urlData=url.parse(req.url,true).query;
  sql=`DELETE FROM home_slider WHERE home_slider_id=${urlData.home_slider_id}`;
  //  res.send(sql);
  con.query(sql,function(err,result)
  {
    res.send(`
              <script>
                alert("Record Deleted Successfully");
                window.location.assign("/admin/slider");
              </script>
           `)
  })
 });
// delete slider end 

// edit slider start 
 router.get("/edit_slider",redirection,function(req,res)
 {
   urlData=url.parse(req.url,true).query;
   sql=`SELECT * FROM home_slider WHERE home_slider_id=${urlData.home_slider_id}`;

  // res.send(sql);
  con.query(sql,function(err,result)
  {
    data={'old_sli':result[0]};
    res.render("admin/edit_slider.ejs",data);
  })
 })
// edit slider end 
// update slider start 
router.post("/update_slider",function(req,res)
{
  // console.log(req.body)
  d=req.body;
  if(req.files)
  {
    sli_img=req.files.fsimg;
    img=new Date().getTime()+sli_img.name;
    sli_img.mv("public/uploads/"+img,function(err){console.log(err)});
    req.body.sli_img=img;
  
    sli_img1=req.files.ssimg;
    img1=new Date().getTime()+sli_img1.name;
    sli_img1.mv("public/uploads/"+img1,function(err){console.log(err)});
    req.body.sli_img1=img1;
    
    sql=`UPDATE home_slider SET fhword='${d.fhword}',ftitle='${d.ftitle}',shword='${d.shword}',stitle='${d.stitle}',
    fdisc='${d.fdisc}',sdisc='${d.sdisc}',fbut='${d.fbut}',f1but='${d.f1but}',sbut='${d.sbut}',s1but='${d.s1but}',
    sli_img='${d.sli_img}',sli_img1='${d.sli_img1}' WHERE home_slider_id='${d.home_slider_id}'`;

  }
  else
  {
    sql=`UPDATE home_slider SET fhword='${d.fhword}',ftitle='${d.ftitle}',shword='${d.shword}',stitle='${d.stitle}',
    fdisc='${d.fdisc}',sdisc='${d.sdisc}',fbut='${d.fbut}',f1but='${d.f1but}',sbut='${d.sbut}',s1but='${d.s1but}'
     WHERE home_slider_id='${d.home_slider_id}'`;
  }
// res.send(sql);
con.query(sql,function(err,result)
{
  res.send(`
           <script>
           alert("Record Sucessfully Updated");
           window.location.assign("/admin/slider/");
           </script>
          `)
});
});
// update slider end 
// Slider page end

// About Disha Start 
router.get("/about_disha",redirection,function(req,res)
{
  sql=query.select("about_disha");
  con.query(sql,function(err,result)
  {
    data={'ad_disha':result}
    res.render("admin/about_disha.ejs",data);
  });
});
// save_about_disha start 
router.post("/save_about_disha",function(req,res)
{
  // console.log(req.body);
  // console.log(req.files);
  about_img=req.files.ad_img;
  img=new Date().getTime()+about_img.name;
  about_img.mv("public/uploads/"+img,function(err){console.log(err)});
  req.body.about_img=img;

  // sql=query.create("about_disha",req.body);
  sql=query.insert("about_disha",req.body);

  // res.send(sql);
  con.query(sql,function(err,result)
  {
    res.send(`
              <script>
              alert("Record Inserted Successfully");
              window.location.assign("/admin/about_disha/");
              </script>
           `);
  });
})
// save_about_disha  end
// delete abot disha start 
router.get("/delete_ad_about",redirection,function(req,res)
{
  urlData=url.parse(req.url,true).query;
  sql=`DELETE FROM about_disha WHERE about_disha_id=${urlData.about_disha_id}`
  con.query(sql,function(err,result)
  {
  res.send(`
           <script>
            alert("Record Deleted Successfully");
            window.location.assign("/admin/about_disha/");
           </script>
          `);
   
  });
});
// delete about disha end 

// edit about disha page  start
 router.get("/edit_ad_about",redirection,function(req,res)
 {
  urlData=url.parse(req.url,true).query;
  
  sql=`SELECT * FROM about_disha WHERE about_disha_id=${urlData.about_disha_id}`;
  con.query(sql,function(err,result)
  {
    data={'old_disha':result[0]};
    res.render("admin/edit_about_disha.ejs",data);

  })
 });
// edit about disha page end 

// update about disha start 
 router.post("/update_about_disha",function(req,res)
 {
    // console.log(req.body);
    // console.log(req.files);
    d=req.body;
    if(req.files)
    {
      about_img=req.files.ad_img1;
      img=new Date().getTime()+about_img.name;
      about_img.mv("public/uploads/"+img,function(err){console.log(err)});
      req.body.about_img=img;
      
      sql=`UPDATE about_disha SET experience='${d.experience}',exp_word='${d.exp_word}',ttitle='${d.ttitle}',
      title='${d.title}',h_word='${d.h_word}',disc='${d.disc}',pro1_name='${d.pro1_name}',
      pro1_value='${d.pro1_value}',pro1_color='${d.pro1_color}',pro2_name='${d.pro2_name}',pro2_value='${d.pro2_value}',
      pro2_color='${d.pro2_color}',pro3_name='${d.pro3_name}',pro3_value='${d.pro3_value}',pro3_color='${d.pro3_color}',
      pro4_name='${d.pro4_name}',pro4_value='${d.pro4_value}',pro4_color='${d.pro4_color}',about_img='${d.about_img}' 
      WHERE about_disha_id='${d.about_disha_id}'`
    }
    else 
    {
      sql=`UPDATE about_disha SET experience='${d.experience}',exp_word='${d.exp_word}',ttitle='${d.ttitle}',
      title='${d.title}',h_word='${d.h_word}',disc='${d.disc}',pro1_name='${d.pro1_name}',
      pro1_value='${d.pro1_value}',pro1_color='${d.pro1_color}',pro2_name='${d.pro2_name}',pro2_value='${d.pro2_value}',
      pro2_color='${d.pro2_color}',pro3_name='${d.pro3_name}',pro3_value='${d.pro3_value}',pro3_color='${d.pro3_color}',
      pro4_name='${d.pro4_name}',pro4_value='${d.pro4_value}',pro4_color='${d.pro4_color}'
      WHERE about_disha_id='${d.about_disha_id}'`
    }

    con.query(sql,function(err,result)
    {
       res.send(`
                <script>
                  alert("Reacord Updated Successfully");
                  window.location.assign("/admin/about_disha/");
                </script>

               `);
  
    });
 });
// update about disha end
// About Disha End 




// services home start 
router.get("/services_head",redirection,function(req,res)
{
sql=query.select("saveservices");
con.query(sql,function(err,result)
{
data={'shead':result};
res.render("admin/services_head.ejs",data);

});
});


// saveservices start 

router.post("/updateservices",function(req,res)
{
 
  // sql=query.create("saveservices",req.body);
  // sql=query.insert("saveservices",req.body);

  d=req.body;
  sql=`UPDATE saveservices SET firsthead='${d.firsthead}',secondhead='${d.secondhead}',thirdhead='${d.thirdhead}'
      WHERE saveservices_id='${d.saveservices_id}'`
  con.query(sql,function(err,result)
  {
  res.send(`
           <script>
                alert("record updated successfully");
                window.location.assign("/admin/services_head/")
           </script>
         `);
  });

});




// services card start 
 
router.get("/services_card",function(req,res)
{
sql=query.select("service_card");
con.query(sql,function(err,result)
{
data={'card_data':result};
res.render("admin/service_card.ejs",data);

});
});


// save service card start 

router.post("/saveservice_card",function(req,res)
{
       card_img=req.files.cimg;
      img=new Date().getTime()+card_img.name;
      card_img.mv("public/uploads/"+img,function(err){console.log(err)});
      req.body.card_img=img;

      // sql=query.create("service_card",req.body);
      sql=query.insert("service_card",req.body);

      con.query(sql,function(err,result)
      {
        res.send(`
        <script>
             alert("card Created successfully");
             window.location.assign("/admin/services_card/")
        </script>
      `);
      });

});
// save service card end 

// delete service card start 
router.get("/delete_hservicard",redirection,function(req,res)
{
  urlData=url.parse(req.url,true).query;
  sql=`DELETE FROM service_card WHERE service_card_id=${urlData.service_card_id}`
  con.query(sql,function(err,result)
  {
  res.send(`
           <script>
            alert("Record Deleted Successfully");
            window.location.assign("/admin/services_card/");
           </script>
          `);
   
  });
});
// delete service card end 


// services card end 

// home baner start 
router.get("/home_baner",redirection,function(req,res)
{
  sql=query.select("home_baner");
  con.query(sql,function(err,result)
  {
    data={'b_home':result}
    res.render("admin/home_baner.ejs",data);
  });
});


// router.get("/home_baner",function(req,res)
// {

// res.render("admin/home_baner.ejs");

// });

router.post("/savehbaner",function(req,res)
{
       b_img=req.files.baner_img;
      img=new Date().getTime()+b_img.name;
      b_img.mv("public/uploads/"+img,function(err){console.log(err)});
      req.body.b_img=img;

      // sql=query.create("home_baner",req.body);
      sql=query.insert("home_baner",req.body);

      con.query(sql,function(err,result)
      {
        res.send(`
        <script>
             alert("Baner Created successfully");
             window.location.assign("/admin/home_baner/")
        </script>
      `);
      });

});
// home baner end
// delete home baner start 
router.get("/delete_homebaner",redirection,function(req,res)
{
 urlData=url.parse(req.url,true).query;
 sql=`DELETE FROM home_baner WHERE home_baner_id=${urlData.home_baner_id}`;
 //  res.send(sql);
 con.query(sql,function(err,result)
 {
   res.send(`
             <script>
               alert("Record Deleted Successfully");
               window.location.assign("/admin/home_baner");
             </script>
          `)
 })
});
// delete home banar end 

// home client start 
// router.get("/home_client",redirection,function(req,res)
// {
// res.render("admin/home_client.ejs");
// });


router.get("/home_client",redirection,function(req,res)
{
  sql=query.select("home_client");
  con.query(sql,function(err,result)
  {
    data={'b_home':result[0]}
    res.render("admin/home_client.ejs",data);
  });
});

// home cliet end 


// save client start 
router.post("/savecliet",function(req,res)
{
  d=req.body;
  if(req.files)
  {
  cli_img1=req.files.client_img1;
  img1=new Date().getTime()+cli_img1.name;
  cli_img1.mv("public/uploads/"+img1,function(err){console.log(err)});
  req.body.cli_img1=img1;

  cli_img2=req.files.client_img2;
  img2=new Date().getTime()+cli_img2.name;
  cli_img2.mv("public/uploads/"+img2,function(err){console.log(err)});
  req.body.cli_img2=img2;

  cli_img3=req.files.client_img3;
  img3=new Date().getTime()+cli_img3.name;
  cli_img3.mv("public/uploads/"+img3,function(err){console.log(err)});
  req.body.cli_img3=img3;

  cli_img4=req.files.client_img4;
  img4=new Date().getTime()+cli_img4.name;
  cli_img4.mv("public/uploads/"+img4,function(err){console.log(err)});
  req.body.cli_img4=img4;

  cli_img5=req.files.cslider_img1;
  img5=new Date().getTime()+cli_img5.name;
  cli_img5.mv("public/uploads/"+img5,function(err){console.log(err)});
  req.body.cli_img5=img5;

  cli_img6=req.files.cslider_img2;
  img6=new Date().getTime()+cli_img6.name;
  cli_img6.mv("public/uploads/"+img6,function(err){console.log(err)});
  req.body.cli_img6=img6;


  sql=`UPDATE home_client SET fthead='${d.fthead}',shead='${d.shead}',fdisc1='${d.fdisc1}',ftitlep1='${d.ftitlep1}',
  stitlep1='${d.stitlep1}',disc2='${d.disc2}',ftitlep2='${d.ftitlep2}',stitlep2='${d.stitlep2}',cli_img1='${d.cli_img1}',cli_img2='${d.cli_img2}',
  cli_img3='${d.cli_img3}',cli_img4='${d.cli_img4}',cli_img5='${d.cli_img5}',cli_img6='${d.cli_img6}' WHERE home_client_id='${d.home_client_id}'`;
}
else
{

  sql=`UPDATE home_client SET fthead='${d.fthead}',shead='${d.shead}',fdisc1='${d.fdisc1}',ftitlep1='${d.ftitlep1}',
  stitlep1='${d.stitlep1}',disc2='${d.disc2}',ftitlep2='${d.ftitlep2}',stitlep2='${d.stitlep2}' WHERE home_client_id='${d.home_client_id}'`;
}
// console.log(sql);
  // sql=query.create("home_client",req.body);
  // sql=query.insert("home_client",req.body);
  con.query(sql,function(err,result)
  {
    res.send(`
    <script>
         alert("Client changes successfully");
         window.location.assign("/admin/home_client/")
    </script>
  `);
  });
});

// save client end 

// portfolio page start 
router.get("/portfolio",redirection,function(req,res)
{
  sql=query.select("portfolio");
  con.query(sql,function(err,result)
  {
    mdata={'port_fo':result};
    res.render("admin/portfolio.ejs",mdata);

  });
});

// portfolio page end

// save portfolio start 

router.post("/portfolio",function(req,res)
{
  
  port_folio=req.files.portfolio_img;
  img=new Date().getTime()+port_folio.name;
  port_folio.mv("public/uploads/"+img,function(err){console.log(err)});
  req.body.port_folio=img;

  // sql=query.create("portfolio",req.body);
  sql=query.insert("portfolio",req.body);

con.query(sql,function(err,result)
{
  res.send(`
  
           <script>
           alert("Record Inserted Successfully");
           window.location.assign("/admin/portfolio/");
           </script>

   
         `);
});
});



// delete slider start 
router.get("/delete_portfolio",redirection,function(req,res)
{
  urlData=url.parse(req.url,true).query;
  sql=`DELETE FROM portfolio WHERE portfolio_id=${urlData.portfolio_id}`
  con.query(sql,function(err,result)
  {
  res.send(`
           <script>
            alert("Record Deleted Successfully");
            window.location.assign("/admin/portfolio/");
           </script>
          `);
   
  });
});
// delete slider end 



// About Page start Here 

router.get("/mabout_disha",redirection,function(req,res)
{
  sql=query.select("mabout_disha");
  con.query(sql,function(err,result)
  {
    mabdata={'m_data':result[0]};
    res.render("admin/mabout_disha.ejs",mabdata);
  });
 
});


// About Page  Here end  

// mabout_disha save start 

router.post("/savemabout_disha",function(req,res)
{
   
  // console.log(req.body)
  d=req.body;
  if(req.files)
  {
    mabout_img=req.files.mabout_img;
    img=new Date().getTime()+mabout_img.name;
    mabout_img.mv("public/uploads/"+img,function(err){console.log(err)});
    req.body.mabout_img=img;
    
    sql=`UPDATE mabout_disha SET fhead='${d.fhead}',shead='${d.shead}',disc='${d.disc}',thead='${d.thead}',
    point1='${d.point1}',point2='${d.point2}',point3='${d.point3}',point4='${d.point4}',point5='${d.point5}',point6='${d.point6}',
    point7='${d.point7}',point8='${d.point8}',mabout_img='${d.mabout_img}' WHERE mabout_disha_id='${d.mabout_disha_id}'`;

  }
  else
  {
    sql=`UPDATE mabout_disha SET fhead='${d.fhead}',shead='${d.shead}',disc='${d.disc}',thead='${d.thead}',
    point1='${d.point1}',point2='${d.point2}',point3='${d.point3}',point4='${d.point4}',point5='${d.point5}',point6='${d.point6}',
    point7='${d.point7}',point8='${d.point8}' WHERE mabout_disha_id='${d.mabout_disha_id}'`;
  }


  // sql=query.create("mabout_disha",req.body);
  // sql=query.insert("mabout_disha",req.body);

  con.query(sql,function(err,result)
  {
    res.send(`
           <script>
            alert("Record updated Successfully");
            window.location.assign("/admin/mabout_disha/");
           </script>
          `);
   
  });
});

// mabout_disha save end
// aboutview start 
router.get("/aboutview",redirection,function(req,res)
{
  sql=query.select("about_view");
  con.query(sql,function(err,result)
  {
    //  console.log(result);
    data={'about_view':result};
    res.render("admin/aboutview.ejs",data);
  });
});

// aboutview end

// saveview_card start 
router.post("/saveview_card",function(req,res)
{
  view_img=req.files.viewimg;
    img=new Date().getTime()+view_img.name;
    view_img.mv("public/uploads/"+img,function(err){console.log(err)});
    req.body.view_img=img;

    // sql=query.create("about_view",req.body);
    sql=query.insert("about_view",req.body);
    con.query(sql,function(err,result)
    {
      res.send(`
              <script>
               alert("Reacord inaserted successfully");
               window.location.assign("/admin/aboutview/");
              </script>
             `);
    });
});

// saveview_card end

// delete View start 
router.get("/delete_abview",redirection,function(req,res)
{
  urlData=url.parse(req.url,true).query;
  sql=`DELETE FROM about_view WHERE about_view_id=${urlData.about_view_id}`
  con.query(sql,function(err,result)
  {
  res.send(`
           <script>
            alert("Record Deleted Successfully");
            window.location.assign("/admin/aboutview/");
           </script>
          `);
   
  });
});
// delete View end 
// edit about disha page  start
router.get("/edit_abview",redirection,function(req,res)
{
 urlData=url.parse(req.url,true).query;
 
 sql=`SELECT * FROM about_view WHERE about_view_id=${urlData.about_view_id}`;
 con.query(sql,function(err,result)
 {
   data={'about_view':result[0]};
   res.render("admin/edit_view.ejs",data);

 })
});
// edit about disha page end 

router.post("/updateview_card",function(req,res)
{
 
  // sql=query.create("saveservices",req.body);
  // sql=query.insert("saveservices",req.body);

  d=req.body;
  if(req.files)
  {
    view_img=req.files.viewimg;
    img=new Date().getTime()+view_img.name;
    view_img.mv("public/uploads/"+img,function(err){console.log(err)});
    req.body.view_img=img;

  sql=`UPDATE about_view SET viewtitle='${d.viewtitle}',viewdisc='${d.viewdisc}',view_img='${d.view_img}'
      WHERE about_view_id='${d.about_view_id}'`;

    }
    else{
      sql=`UPDATE about_view SET viewtitle='${d.viewtitle}',viewdisc='${d.viewdisc}'
      WHERE about_view_id='${d.about_view_id}'`;
    }
  con.query(sql,function(err,result)
  {
  res.send(`
           <script>
                alert("record updated successfully");
                window.location.assign("/admin/aboutview/");
           </script>
         `);
  });

});

// about banar start 

router.get("/about_baner",redirection,function(req,res)
{
  sql=query.select("about_banar");
  con.query(sql,function(err,result)
  {
    data={'baner':result[0]};
    res.render("admin/about_baner.ejs",data);

  });
});

router.post("/saveabout_baner",function(req,res)
{
  // console.log(req.body);
  d=req.body;
  if(req.files)
  {
  view_img=req.files.bg_img;
    img=new Date().getTime()+view_img.name;
    view_img.mv("public/uploads/"+img,function(err){console.log(err)});
    req.body.view_img=img;
 

    sql=`UPDATE about_banar SET fthead='${d.fthead}',shead='${d.shead}',point1='${d.point1}',
    point2='${d.point2}',point3='${d.point3}',view_img='${d.view_img}'
    WHERE about_banar_id='${d.about_banar_id}'`;

  }
else 
{
  sql=`UPDATE about_banar SET fthead='${d.fthead}',shead='${d.shead}',point1='${d.point1}',
    point2='${d.point2}',point3='${d.point3}'
    WHERE about_banar_id='${d.about_banar_id}'`;
}
    // sql=query.create("about_banar",req.body);
    // sql=query.insert("about_banar",req.body);
    con.query(sql,function(err,result)
    {
      // console.log(err);
      res.send(`
              <script>
               alert("Reacord Update Successfully");
               window.location.assign("/admin/about_baner/");
              </script>
             `);
    });
});

// save about Slider our team start

router.get("/about_team",redirection,function(req,res)
{
  sql=query.select("about_team");
  con.query(sql,function(err,result)
  {
    data={'team':result[0]}
    res.render("admin/about_team.ejs",data);

  });
});


router.post("/saveabout_slider",function(req,res)
{
  d=req.body;
  if(req.files)
  {
    
  sli_img=req.files.fsimg;
  img=new Date().getTime()+sli_img.name;
  sli_img.mv("public/uploads/"+img,function(err){console.log(err)});
  req.body.sli_img=img;

  sli_img1=req.files.ssimg;
  img1=new Date().getTime()+sli_img1.name;
  sli_img1.mv("public/uploads/"+img1,function(err){console.log(err)});
  req.body.sli_img1=img1;

  sql=`UPDATE about_team SET ftitle='${d.ftitle}',stitle='${d.stitle}',
  fdisc='${d.fdisc}',sdisc='${d.sdisc}',mtitle1='${d.mtitle1}',mtitle2='${d.mtitle2}',
  sli_img='${d.sli_img}',sli_img1='${d.sli_img1}' WHERE about_team_id='${d.about_team_id}'`;

}
else{
  sql=`UPDATE about_team SET ftitle='${d.ftitle}',stitle='${d.stitle}',mtitle1='${d.mtitle1}',mtitle2='${d.mtitle2}',
  fdisc='${d.fdisc}',sdisc='${d.sdisc}' WHERE about_team_id='${d.about_team_id}'`;
}
  // sql=query.create("about_team",req.body);
  // sql=query.insert("about_team",req.body);

  con.query(sql,function(err,result)
  {
    res.send(`
             <script>
               alert("Record Inserted Successfully");
               window.location.assign("/admin/about_team");
             </script>
           `);
  });

});

// About page end 


// csc page start here 



router.get("/csc_heading",redirection,function(req,res)
{
  sql=query.select("csc_head");
  con.query(sql,function(err,result)
  {
    // console.log(result);
    data={'head':result[0]}
    res.render("admin/csc_heading.ejs",data);
  });
  

});

router.post("/save_cschead",function(req,res)
{
  d=req.body;
  // sql=query.create("csc_head",req.body);
  sql=query.insert("csc_head",req.body);
  sql=`UPDATE csc_head SET first_head='${d.first_head}',shead='${d.shead}',tirdhead='${d.tirdhead}'
   WHERE csc_head_id='${d.csc_head_id}'`;
  con.query(sql,function(err,result)
  {
    res.send(`
    
           <script>
           alert("Record Updated Successfully");
           window.location.assign("/admin/csc_heading/");
           </script> 
    
           `);
  });
});
// csc page end here


// csc card start 

router.get("/csc_card",redirection,function(req,res)
{
  sql=query.select("savecsc_card");
  con.query(sql,function(err,result)
  {
    data={'csc_card':result}
    res.render("admin/csc_card.ejs",data);
  });
});

// csc card end


// savecsc_card start 

router.post("/savecsc_card",function(req,res)
{
  csc_card_img=req.files.cimg;
  img=new Date().getTime()+csc_card_img.name;
  csc_card_img.mv("public/uploads/"+img,function(err){console.log(err)});
  req.body.csc_card_img=img;

  // sql=query.create("savecsc_card",req.body);
  sql=query.insert("savecsc_card",req.body);
  con.query(sql,function(err,result)
  {
    res.send(`
            <script>
             alert("Record Inserted Successfully");
            window.location.assign("/admin/csc_card/");
            </script>
           `);
  });
});

// savecsc_card end


// delete csc_card start 
router.get("/delete_csc_card",redirection,function(req,res)
{
  urlData=url.parse(req.url,true).query;
  sql=`DELETE FROM savecsc_card WHERE savecsc_card_id=${urlData.savecsc_card_id}`
  con.query(sql,function(err,result)
  {
  res.send(`
           <script>
            alert("Record Deleted Successfully");
            window.location.assign("/admin/csc_card/");
           </script>
          `);
   
  });
});
// delete  csc_card end 

// course page start 

router.get("/course_slider",redirection,function(req,res)
{
  sql=query.select("course_slider");
  con.query(sql,function(err,result)
  {

    data={'course_sli':result[0]}
    res.render("admin/course_slider.ejs",data);
  });
});





router.post("/savecourse_slider",function(req,res)
{
  d=req.body;
  
  if(req.files)
  {
  cli_img1=req.files.fsimg;
  img1=new Date().getTime()+cli_img1.name;
  cli_img1.mv("public/uploads/"+img1,function(err){console.log(err)});
  req.body.cli_img1=img1;

  cli_img2=req.files.ssimg;
  img2=new Date().getTime()+cli_img2.name;
  cli_img2.mv("public/uploads/"+img2,function(err){console.log(err)});
  req.body.cli_img2=img2;

  cli_img3=req.files.tsimg;
  img3=new Date().getTime()+cli_img3.name;
  cli_img3.mv("public/uploads/"+img3,function(err){console.log(err)});
  req.body.cli_img3=img3;

  sql=`UPDATE course_slider SET fsubtitle='${d.fsubtitle}',ssubtitle='${d.ssubtitle}',
  tsubtitle='${d.tsubtitle}',ftitle='${d.ftitle}',stitle='${d.stitle}',ttitle='${d.ttitle}',
  fdisc='${d.fdisc}',sdisc='${d.sdisc}',tdisc='${d.tdisc}',cli_img1='${d.cli_img1}'
  ,cli_img2='${d.cli_img2}',cli_img3='${d.cli_img3}' WHERE course_slider_id='${d.course_slider_id}'`;

}
else
{
  sql=`UPDATE course_slider SET fsubtitle='${d.fsubtitle}',ssubtitle='${d.ssubtitle}',
  tsubtitle='${d.tsubtitle}',ftitle='${d.ftitle}',stitle='${d.stitle}',ttitle='${d.ttitle}',
  fdisc='${d.fdisc}',sdisc='${d.sdisc}',tdisc='${d.tdisc}' WHERE course_slider_id='${d.course_slider_id}'`;
}
  // sql=query.create("course_slider",req.body);
  // sql=query.insert("course_slider",req.body);
  con.query(sql,function(err,result)
  {
    res.send(`
    <script>
         alert("Client changes successfully");
         window.location.assign("/admin/course_slider/")
    </script>
  `);
  });
});

// course page end 


// MSCIT PAGE START
router.get("/mscit_welcome",redirection,function(req,res)
{
  sql=query.select("welcome_mscit");
  con.query(sql,function(err,result)
  {
   data={'wel_mscit':result[0]}
   res.render("admin/mscit_welcome.ejs",data);
  });
});

// save welcome mascit start 
router.post("/savecmscit_welcome",function(req,res)
{
  
  d=req.body;
  
  if(req.files)
  {
  mscit_img=req.files.cwelimg;
  img=new Date().getTime()+mscit_img.name;
  mscit_img.mv("public/uploads/"+img,function(err){console.log(err)});
  req.body.mscit_img=img;

  sql=`UPDATE welcome_mscit SET cmfhead1='${d.cmfhead1}',cmfhead2='${d.cmfhead2}',
  cwelhead1='${d.cwelhead1}',cwelhead2='${d.cwelhead2}',cwelp1='${d.cwelp1}',cwelp2='${d.cwelp2}',
  cwelp3='${d.cwelp3}',cwelp4='${d.cwelp4}',mscit_img='${d.mscit_img}' WHERE welcome_mscit_id='${d.welcome_mscit_id}'`;

  }
  else
  {
    sql=`UPDATE welcome_mscit SET cmfhead1='${d.cmfhead1}',cmfhead2='${d.cmfhead2}',
    cwelhead1='${d.cwelhead1}',cwelhead2='${d.cwelhead2}',cwelp1='${d.cwelp1}',cwelp2='${d.cwelp2}',
    cwelp3='${d.cwelp3}',cwelp4='${d.cwelp4}' WHERE welcome_mscit_id='${d.welcome_mscit_id}'`;
  }
  // sql=query.create("welcome_mscit",req.body);
  // sql=query.insert("welcome_mscit",req.body);
  // console.log(sql);
  con.query(sql,function(err,result)
  {
    res.send(`
            <script>
             alert("Record Updated Successfully");
            window.location.assign("/admin/mscit_welcome/");
            </script>
           `);
  });
});

// save welcome mascit end



//  important mascit start 

router.get("/mscit_important",redirection,function(req,res)
{
  sql=query.select("mscit_important");
  con.query(sql,function(err,result)
  {
   data={'mscit':result[0]}
   res.render("admin/mscit_important.ejs",data);
  });
});

// save important mascit start 
router.post("/savecmscit_important",function(req,res)
{
  
  d=req.body;
  
  if(req.files)
  {
  mscit_img1=req.files.cpointsimg;
  img=new Date().getTime()+mscit_img1.name;
  mscit_img1.mv("public/uploads/"+img,function(err){console.log(err)});
  req.body.mscit_img1=img;

  sql=`UPDATE mscit_important SET cpointsmhead1='${d.cpointsmhead1}',cpointsmhead2='${d.cpointsmhead2}',
  cpointshead1='${d.cpointshead1}',cpointshead2='${d.cpointshead2}',cpointsp1='${d.cpointsp1}',cpointsp2='${d.cpointsp2}',
  cpointsp3='${d.cpointsp3}',cpointsp4='${d.cpointsp4}',cpointsp5='${d.cpointsp5}',cpointsp6='${d.cpointsp6}',mscit_img1='${d.mscit_img1}' WHERE mscit_important_id='${d.mscit_important_id}'`;

  }
  else
  {
    sql=`UPDATE mscit_important SET cpointsmhead1='${d.cpointsmhead1}',cpointsmhead2='${d.cpointsmhead2}',
    cpointshead1='${d.cpointshead1}',cpointshead2='${d.cpointshead2}',cpointsp1='${d.cpointsp1}',cpointsp2='${d.cpointsp2}',
    cpointsp3='${d.cpointsp3}',cpointsp4='${d.cpointsp4}',cpointsp5='${d.cpointsp5}',cpointsp6='${d.cpointsp6}'WHERE mscit_important_id='${d.mscit_important_id}'`;
  }
  // sql=query.create("mscit_important",req.body);
  // sql=query.insert("mscit_important",req.body);
  con.query(sql,function(err,result)
  {
    res.send(`
            <script>
             alert("Record Updated Successfully");
            window.location.assign("/admin/mscit_important/");
            </script>
           `);
  });
});

// save important mascit end


// mscit banar start 
 
router.get("/mscit_banar",redirection,function(req,res)
{
  sql=query.select("banar_mscit");
  con.query(sql,function(err,result)
  {
   data={'mscit':result[0]}
   res.render("admin/mscit_banar.ejs",data);
  });
});

// save banar mascit start 
router.post("/savecmscit_banar",function(req,res)
{
  
  d=req.body;
  
  if(req.files)
  {
  mscit_img2=req.files.cbanarimg;
  img=new Date().getTime()+mscit_img2.name;
  mscit_img2.mv("public/uploads/"+img,function(err){console.log(err)});
  req.body.mscit_img2=img;

  sql=`UPDATE banar_mscit SET cbanarhaed1='${d.cbanarhaed1}',cbanarhead2='${d.cbanarhead2}',
  cbanarp1='${d.cbanarp1}',cbanarp2='${d.cbanarp2}',ccbanarp3='${d.ccbanarp3}',mscit_img2='${d.mscit_img2}'
   WHERE banar_mscit_id='${d.banar_mscit_id}'`;

  }
  else
  {
    sql=`UPDATE banar_mscit SET cbanarhaed1='${d.cbanarhaed1}',cbanarhead2='${d.cbanarhead2}',
  cbanarp1='${d.cbanarp1}',cbanarp2='${d.cbanarp2}',ccbanarp3='${d.ccbanarp3}'
   WHERE banar_mscit_id='${d.banar_mscit_id}'`;
  }
  // sql=query.create("banar_mscit",req.body);
  // sql=query.insert("banar_mscit",req.body);
  con.query(sql,function(err,result)
  {
    res.send(`
            <script>
             alert("Record Updated Successfully");
            window.location.assign("/admin/mscit_banar/");
            </script>
           `);
  });
});

// save banar mascit end

// mscit features start 
 
router.get("/mscit_features",redirection,function(req,res)
{
  sql=query.select("mscit_features");
  con.query(sql,function(err,result)
  {
   data={'mscit':result[0]}
   res.render("admin/mscit_features.ejs",data);
  });
});

// save features mascit start 
router.post("/savecmscit_features",function(req,res)
{
  
  d=req.body;
  
  
    sql=`UPDATE mscit_features SET cfeture1head1='${d.cfeture1head1}',cfeture1head2='${d.cfeture1head2}',
  cfeture1p1='${d.cfeture1p1}',cfeture1p2='${d.cfeture1p2}',cfeture1p3='${d.cfeture1p3}',cfeture1p4='${d.cfeture1p4}'
  ,cfeture1p5='${d.cfeture1p5}',cfeture1p6='${d.cfeture1p6}',cfeture2head1='${d.cfeture2head1}',cfeture2head2='${d.cfeture2head2}'
  ,cfeture2p1='${d.cfeture2p1}',cfeture2p2='${d.cfeture2p2}',cfeture2p3='${d.cfeture2p3}',cfeture2p4='${d.cfeture2p4}'
  ,cfeture2p5='${d.cfeture2p5}',cfeture2p6='${d.cfeture2p6}'
   WHERE mscit_features_id='${d.mscit_features_id}'`;

  // sql=query.create("mscit_features",req.body);
  // sql=query.insert("mscit_features",req.body);
  con.query(sql,function(err,result)
  {
    res.send(`
            <script>
             alert("Record Updated Successfully");
            window.location.assign("/admin/mscit_features/");
            </script>
           `);
  });
});

// save features mascit end

// MSCIT PAGE END

// TYPING PAGE START 
// welcome start 
router.get("/typing_welcome",redirection,function(req,res)
{
  sql=query.select("typing_welcome");
  con.query(sql,function(err,result)
  {
   data={'wel_typing':result[0]}
   res.render("admin/typing_welcome.ejs",data);
  });
});

// save welcome mascit start



// save welcome TYPING start 
router.post("/savectyping_welcome",function(req,res)
{
  
  d=req.body;
  
  if(req.files)
  {
  mscit_img=req.files.cwelimg1;
  img=new Date().getTime()+mscit_img.name;
  mscit_img.mv("public/uploads/"+img,function(err){console.log(err)});
  req.body.mscit_img=img;

  sql=`UPDATE typing_welcome SET cmfhead1='${d.cmfhead1}',cmfhead2='${d.cmfhead2}',
  cwelhead1='${d.cwelhead1}',cwelhead2='${d.cwelhead2}',cwelp1='${d.cwelp1}',cwelp2='${d.cwelp2}',
  cwelp3='${d.cwelp3}',cwelp4='${d.cwelp4}',mscit_img='${d.mscit_img}' WHERE typing_welcome_id='${d.typing_welcome_id}'`;

  }
  else
  {
    sql=`UPDATE typing_welcome SET cmfhead1='${d.cmfhead1}',cmfhead2='${d.cmfhead2}',
    cwelhead1='${d.cwelhead1}',cwelhead2='${d.cwelhead2}',cwelp1='${d.cwelp1}',cwelp2='${d.cwelp2}',
    cwelp3='${d.cwelp3}',cwelp4='${d.cwelp4}' WHERE typing_welcome_id='${d.typing_welcome_id}'`;
  }
  // sql=query.create("typing_welcome",req.body);
  // sql=query.insert("typing_welcome",req.body);
  con.query(sql,function(err,result)
  {
    res.send(`
            <script>
             alert("Record Updated Successfully");
            window.location.assign("/admin/typing_welcome/");
            </script>
           `);
  });
});

// save welcome TYPING end

//  important typing start 

router.get("/typing_important",redirection,function(req,res)
{
  sql=query.select("typing_important");
  con.query(sql,function(err,result)
  {
   data={'typing':result[0]}
   res.render("admin/typing_important.ejs",data);
  });
});




// save important typing start 
router.post("/savectyping_important",function(req,res)
{
  
  d=req.body;
  
  if(req.files)
  {
  mscit_img1=req.files.cpointsimg2;
  img=new Date().getTime()+mscit_img1.name;
  mscit_img1.mv("public/uploads/"+img,function(err){console.log(err)});
  req.body.mscit_img1=img;

  sql=`UPDATE typing_important SET cpointsmhead1='${d.cpointsmhead1}',cpointsmhead2='${d.cpointsmhead2}',
  cpointshead1='${d.cpointshead1}',cpointshead2='${d.cpointshead2}',cpointsp1='${d.cpointsp1}',cpointsp2='${d.cpointsp2}',
  cpointsp3='${d.cpointsp3}',cpointsp4='${d.cpointsp4}',cpointsp5='${d.cpointsp5}',cpointsp6='${d.cpointsp6}',mscit_img1='${d.mscit_img1}' WHERE typing_important_id='${d.typing_important_id}'`;

  }
  else
  {
    sql=`UPDATE typing_important SET cpointsmhead1='${d.cpointsmhead1}',cpointsmhead2='${d.cpointsmhead2}',
    cpointshead1='${d.cpointshead1}',cpointshead2='${d.cpointshead2}',cpointsp1='${d.cpointsp1}',cpointsp2='${d.cpointsp2}',
    cpointsp3='${d.cpointsp3}',cpointsp4='${d.cpointsp4}',cpointsp5='${d.cpointsp5}',cpointsp6='${d.cpointsp6}'WHERE typing_important_id='${d.typing_important_id}'`;
  }
  // sql=query.create("typing_important",req.body);
  // sql=query.insert("typing_important",req.body);
  con.query(sql,function(err,result)
  {
    res.send(`
            <script>
             alert("Record Updated Successfully");
            window.location.assign("/admin/typing_important/");
            </script>
           `);
  });
});

// save important typing end


// typing banar start 
 
router.get("/typing_banar",redirection,function(req,res)
{
  sql=query.select("banar_typing");
  con.query(sql,function(err,result)
  {
   data={'typing':result[0]}
   res.render("admin/typing_banar.ejs",data);
  });
});


// save typing mascit start 
router.post("/savectyping_banar",function(req,res)
{
  
  d=req.body;
  
  if(req.files)
  {
  mscit_img2=req.files.cbanarimg;
  img=new Date().getTime()+mscit_img2.name;
  mscit_img2.mv("public/uploads/"+img,function(err){console.log(err)});
  req.body.mscit_img2=img;

  sql=`UPDATE banar_typing SET cbanarhaed1='${d.cbanarhaed1}',cbanarhead2='${d.cbanarhead2}',
  cbanarp1='${d.cbanarp1}',cbanarp2='${d.cbanarp2}',ccbanarp3='${d.ccbanarp3}',mscit_img2='${d.mscit_img2}'
   WHERE banar_typing_id='${d.banar_typing_id}'`;

  }
  else
  {
    sql=`UPDATE banar_typing SET cbanarhaed1='${d.cbanarhaed1}',cbanarhead2='${d.cbanarhead2}',
  cbanarp1='${d.cbanarp1}',cbanarp2='${d.cbanarp2}',ccbanarp3='${d.ccbanarp3}'
   WHERE banar_typing_id='${d.banar_typing_id}'`;
  }
  // sql=query.create("banar_typing",req.body);
  // sql=query.insert("banar_typing",req.body);
  con.query(sql,function(err,result)
  {
    res.send(`
            <script>
             alert("Record Updated Successfully");
            window.location.assign("/admin/typing_banar/");
            </script>
           `);
  });
});

// save banar typing end



// typing features start 
 
router.get("/typing_features",redirection,function(req,res)
{
  sql=query.select("typing_features");
  con.query(sql,function(err,result)
  {
   data={'typing':result[0]}
   res.render("admin/typing_features.ejs",data);
  });
});

// save features typing start 
router.post("/savectyping_features",function(req,res)
{
  
  d=req.body;
  
  
    sql=`UPDATE typing_features SET cfeture1head1='${d.cfeture1head1}',cfeture1head2='${d.cfeture1head2}',
  cfeture1p1='${d.cfeture1p1}',cfeture1p2='${d.cfeture1p2}',cfeture1p3='${d.cfeture1p3}',cfeture1p4='${d.cfeture1p4}'
  ,cfeture1p5='${d.cfeture1p5}',cfeture1p6='${d.cfeture1p6}',cfeture2head1='${d.cfeture2head1}',cfeture2head2='${d.cfeture2head2}'
  ,cfeture2p1='${d.cfeture2p1}',cfeture2p2='${d.cfeture2p2}',cfeture2p3='${d.cfeture2p3}',cfeture2p4='${d.cfeture2p4}'
  ,cfeture2p5='${d.cfeture2p5}',cfeture2p6='${d.cfeture2p6}'
   WHERE typing_features_id='${d.typing_features_id}'`;

  // sql=query.create("typing_features",req.body);
  // sql=query.insert("typing_features",req.body);
  con.query(sql,function(err,result)
  {
    res.send(`
            <script>
             alert("Record Updated Successfully");
            window.location.assign("/admin/typing_features/");
            </script>
           `);
  });
});

// save features typing end

// TYPING PAGE END 


// ccc page start

// welcome typing start
router.get("/ccc_welcome",redirection,function(req,res)
{
  sql=query.select("ccc_welcome");
  con.query(sql,function(err,result)
  {
   data={'ccc_typing':result[0]}
   res.render("admin/ccc_welcome.ejs",data);
  });
});

// welcome typing end
// save welcome CCC start 
router.post("/savecccc_welcome",function(req,res)
{
  // console.log(req.body);
  d=req.body;
  
  if(req.files)
  {
  mscit_img=req.files.cwelimg1;
  img=new Date().getTime()+mscit_img.name;
  mscit_img.mv("public/uploads/"+img,function(err){console.log(err)});
  req.body.mscit_img=img;

  sql=`UPDATE ccc_welcome SET cmfhead1='${d.cmfhead1}',cmfhead2='${d.cmfhead2}',
  cwelhead1='${d.cwelhead1}',cwelhead2='${d.cwelhead2}',cwelp1='${d.cwelp1}',cwelp2='${d.cwelp2}',
  cwelp3='${d.cwelp3}',cwelp4='${d.cwelp4}',mscit_img='${d.mscit_img}' WHERE ccc_welcome_id='${d.ccc_welcome_id}'`;

  }
  else
  {
    sql=`UPDATE ccc_welcome SET cmfhead1='${d.cmfhead1}',cmfhead2='${d.cmfhead2}',
    cwelhead1='${d.cwelhead1}',cwelhead2='${d.cwelhead2}',cwelp1='${d.cwelp1}',cwelp2='${d.cwelp2}',
    cwelp3='${d.cwelp3}',cwelp4='${d.cwelp4}' WHERE ccc_welcome_id='${d.ccc_welcome_id}'`;
  }
  // sql=query.create("ccc_welcome",req.body);
  // sql=query.insert("ccc_welcome",req.body);
  con.query(sql,function(err,result)
  {
    res.send(`
            <script>
             alert("Record Updated Successfully");
            window.location.assign("/admin/ccc_welcome/");
            </script>
           `);
  });
});

// save welcome CCC end

//  important ccc start 

router.get("/ccc_important",redirection,function(req,res)
{
  sql=query.select("ccc_important");
  con.query(sql,function(err,result)
  {
   data={'ccc':result[0]}
   res.render("admin/ccc_important.ejs",data);
  });
});




// save important ccc start 
router.post("/saveccc_important",function(req,res)
{
  
  d=req.body;
  
  if(req.files)
  {
  mscit_img1=req.files.cpointsimg2;
  img=new Date().getTime()+mscit_img1.name;
  mscit_img1.mv("public/uploads/"+img,function(err){console.log(err)});
  req.body.mscit_img1=img;

  sql=`UPDATE ccc_important SET cpointsmhead1='${d.cpointsmhead1}',cpointsmhead2='${d.cpointsmhead2}',
  cpointshead1='${d.cpointshead1}',cpointshead2='${d.cpointshead2}',cpointsp1='${d.cpointsp1}',cpointsp2='${d.cpointsp2}',
  cpointsp3='${d.cpointsp3}',cpointsp4='${d.cpointsp4}',cpointsp5='${d.cpointsp5}',cpointsp6='${d.cpointsp6}',mscit_img1='${d.mscit_img1}' WHERE ccc_important_id='${d.ccc_important_id}'`;

  }
  else
  {
    sql=`UPDATE ccc_important SET cpointsmhead1='${d.cpointsmhead1}',cpointsmhead2='${d.cpointsmhead2}',
    cpointshead1='${d.cpointshead1}',cpointshead2='${d.cpointshead2}',cpointsp1='${d.cpointsp1}',cpointsp2='${d.cpointsp2}',
    cpointsp3='${d.cpointsp3}',cpointsp4='${d.cpointsp4}',cpointsp5='${d.cpointsp5}',cpointsp6='${d.cpointsp6}'WHERE ccc_important_id='${d.ccc_important_id}'`;
  }
  // sql=query.create("ccc_important",req.body);
  // sql=query.insert("ccc_important",req.body);
  con.query(sql,function(err,result)
  {
    res.send(`
            <script>
             alert("Record Updated Successfully");
            window.location.assign("/admin/ccc_important/");
            </script>
           `);
  });
});

// save important ccc end



// typing banar start 
 
router.get("/ccc_banar",redirection,function(req,res)
{
  sql=query.select("ccc_banar");
  con.query(sql,function(err,result)
  {
   data={'ccc':result[0]}
   res.render("admin/ccc_banar.ejs",data);
  });
});


// save typing mascit start 
router.post("/saveccc_banar",function(req,res)
{
  
  d=req.body;
  
  if(req.files)
  {
  mscit_img2=req.files.cbanarimg;
  img=new Date().getTime()+mscit_img2.name;
  mscit_img2.mv("public/uploads/"+img,function(err){console.log(err)});
  req.body.mscit_img2=img;

  sql=`UPDATE ccc_banar SET cbanarhaed1='${d.cbanarhaed1}',cbanarhead2='${d.cbanarhead2}',
  cbanarp1='${d.cbanarp1}',cbanarp2='${d.cbanarp2}',ccbanarp3='${d.ccbanarp3}',mscit_img2='${d.mscit_img2}'
   WHERE ccc_banar_id='${d.ccc_banar_id}'`;

  }
  else
  {
    sql=`UPDATE ccc_banar SET cbanarhaed1='${d.cbanarhaed1}',cbanarhead2='${d.cbanarhead2}',
  cbanarp1='${d.cbanarp1}',cbanarp2='${d.cbanarp2}',ccbanarp3='${d.ccbanarp3}'
   WHERE ccc_banar_id='${d.ccc_banar_id}'`;
  }
  // sql=query.create("ccc_banar",req.body);
  // sql=query.insert("ccc_banar",req.body);
  con.query(sql,function(err,result)
  {
    res.send(`
            <script>
             alert("Record Updated Successfully");
            window.location.assign("/admin/ccc_banar/");
            </script>
           `);
  });
});

// save banar ccc end
// typing features start 
 
router.get("/ccc_features",redirection,function(req,res)
{
  sql=query.select("ccc_features");
  con.query(sql,function(err,result)
  {
   data={'ccc':result[0]}
   res.render("admin/ccc_features.ejs",data);
  });
});

// save features ccc_features start 
router.post("/saveccc_features",function(req,res)
{
  
  d=req.body;
  
  
    sql=`UPDATE ccc_features SET cfeture1head1='${d.cfeture1head1}',cfeture1head2='${d.cfeture1head2}',
  cfeture1p1='${d.cfeture1p1}',cfeture1p2='${d.cfeture1p2}',cfeture1p3='${d.cfeture1p3}',cfeture1p4='${d.cfeture1p4}'
  ,cfeture1p5='${d.cfeture1p5}',cfeture1p6='${d.cfeture1p6}',cfeture2head1='${d.cfeture2head1}',cfeture2head2='${d.cfeture2head2}'
  ,cfeture2p1='${d.cfeture2p1}',cfeture2p2='${d.cfeture2p2}',cfeture2p3='${d.cfeture2p3}',cfeture2p4='${d.cfeture2p4}'
  ,cfeture2p5='${d.cfeture2p5}',cfeture2p6='${d.cfeture2p6}'
   WHERE ccc_features_id='${d.ccc_features_id}'`;

  // sql=query.create("ccc_features",req.body);
  // sql=query.insert("ccc_features",req.body);
  con.query(sql,function(err,result)
  {
    res.send(`
            <script>
             alert("Record Updated Successfully");
            window.location.assign("/admin/ccc_features/");
            </script>
           `);
  });
});

// save features ccc_features end
// ccc page end

// constants us page start 

router.get("/contact_us",redirection,function(req,res)
{
  sql=query.select("contact_us");
  con.query(sql,function(err,result)
  {
   data={'contact':result[0]}
   res.render("admin/contact_us.ejs",data);
});
});


// save contact us start 
router.post("/savecontact_us",function(req,res)
{
  
  d=req.body;
  
  
    sql=`UPDATE contact_us SET haed1='${d.haed1}',head2='${d.head2}',
  office_address='${d.office_address}',pnumber='${d.pnumber}',email='${d.email}'
   WHERE contact_us_id='${d.contact_us_id}'`;

  // sql=query.create("contact_us",req.body);
  // sql=query.insert("contact_us",req.body);
  con.query(sql,function(err,result)
  {
    res.send(`
            <script>
             alert("Record Updated Successfully");
            window.location.assign("/admin/contact_us/");
            </script>
           `);
  });
});

// save  contact us end
// constants us page end
// contact persons page start 
router.get("/contact_person",redirection,function(req,res)
{
  sql=query.select("contactus");
  con.query(sql,function(err,result)
  {
   data={'contactp':result}
   res.render("admin/contact_person.ejs",data);
});
});

// contact persons page end


// delete contact person start 
router.get("/delete_contactp",function(req,res)
{
  urlData=url.parse(req.url,true).query;
  sql=`DELETE FROM contactus WHERE contactus_id=${urlData.contactus_id}`
  con.query(sql,function(err,result)
  {
  res.send(`
           <script>
            window.location.assign("/admin/contact_person/");
           </script>
          `);
   
  });
});
// delete  contact person end 

// footer address start 
router.get("/footer_address",redirection,function(req,res)
{
  sql=query.select("footer_address");
  con.query(sql,function(err,result)
  {
   data={'footer':result[0]}
res.render("admin/footer_address.ejs",data);
});
});

// footer address end


// save v start 
router.post("/savefooter_address",function(req,res)
{
  
  d=req.body;
  
  
    sql=`UPDATE footer_address SET head1='${d.head1}',head2='${d.head2}',
  village='${d.village}',dist='${d.dist}',statepin='${d.statepin}',cnumber='${d.cnumber}'
   WHERE footer_address_id='${d.footer_address_id}'`;

  // sql=query.create("footer_address",req.body);
  // sql=query.insert("footer_address",req.body);
  con.query(sql,function(err,result)
  {
    res.send(`
            <script>
             alert("Record Updated Successfully");
            window.location.assign("/admin/footer_address/");
            </script>
           `);
  });
});

// save  footer address end

// admission form start 

router.get("/view_admissions",redirection,function(req,res)
{
  sql=query.select("admissionform");
  con.query(sql,function(err,result)
  {
    data={'admission':result};
    res.render("admin/view_admission.ejs",data);
  });

});


// admission form start 


// delete admission form start 
router.get("/delete_admissionform",redirection,function(req,res)
{
  urlData=url.parse(req.url,true).query;
  sql=`DELETE FROM admissionform WHERE admissionform_id=${urlData.admissionform_id}`
  con.query(sql,function(err,result)
  {
  res.send(`
           <script>
            alert("Record Deleted Successfully");
            window.location.assign("/admin/view_admissions/");
           </script>
          `);
   
  });
});
// delete  admission form end 

// details_admissionform form start 

router.get("/details_admissionform",redirection,function(req,res)
{
  urlData=url.parse(req.url,true).query;
  sql=`SELECT * FROM admissionform WHERE admissionform_id=${urlData.admissionform_id}`
  con.query(sql,function(err,result)
  {
    data={'admission':result[0]};
    res.render("admin/details_admissionform.ejs",data);
  });

});


// details_admissionform form start 




// logout page start 

router.get("/logout",redirection,function(req,res)
{
  req.session.destroy((err) => {

    res.redirect('/admin') // will always fire after session is destroyed
  })

});

// logout page end 

// view registration page start 
router.get("/view_registrations",function(req,res)
{

  sql=query.select("user");
  con.query(sql,function(err,result)
  {
    data={'users':result};
    res.render("admin/view_registrations.ejs",data);
  });

});

// view registration page end

// delete user form start 
router.get("/delete_users",redirection,function(req,res)
{
  urlData=url.parse(req.url,true).query;
  sql=`DELETE FROM user WHERE user_id=${urlData.user_id}`
  con.query(sql,function(err,result)
  {
  res.send(`
           <script>
            alert("Record Deleted Successfully");
            window.location.assign("/admin/view_registrations/");
           </script>
          `);
   
  });
});
// delete  user form end 

// top_banar start 

router.get("/top_banar",redirection,function(req,res)
{
  sql=query.select("all_topbar");
  con.query(sql,function(err,result)
  {
    data={'users':result[0]};
     res.render("admin/top_banar.ejs",data);
});
});



// top_banar end 

router.post("/abcsccon_banar",function(req,res)
{

  d=req.body;
  
  if(req.files)
  {
  cli_img1=req.files.abimg1;
  img1=new Date().getTime()+cli_img1.name;
  cli_img1.mv("public/uploads/"+img1,function(err){console.log(err)});
  req.body.cli_img1=img1;

  cli_img2=req.files.cscimg2;
  img2=new Date().getTime()+cli_img2.name;
  cli_img2.mv("public/uploads/"+img2,function(err){console.log(err)});
  req.body.cli_img2=img2;

  cli_img3=req.files.conimg3;
  img3=new Date().getTime()+cli_img3.name;
  cli_img3.mv("public/uploads/"+img3,function(err){console.log(err)});
  req.body.cli_img3=img3;

  sql=`UPDATE all_topbar SET abtitle1='${d.abtitle1}',abtitle2='${d.abtitle2}',
  csctitle1='${d.csctitle1}',csctitle2='${d.csctitle2}',contitle1='${d.contitle1}',contitle2='${d.contitle2}',
  cli_img1='${d.cli_img1}',cli_img2='${d.cli_img2}',cli_img3='${d.cli_img3}' WHERE all_topbar_id='${d.all_topbar_id}'`;

}
else
{

  sql=`UPDATE all_topbar SET abtitle1='${d.abtitle1}',abtitle2='${d.abtitle2}',
  csctitle1='${d.csctitle1}',csctitle2='${d.csctitle2}',contitle1='${d.contitle1}',contitle2='${d.contitle2}'
   WHERE all_topbar_id='${d.all_topbar_id}'`;
}


// sql=query.create("all_topbar",req.body);
// sql=query.insert("all_topbar",req.body);

con.query(sql,function(err,result)
{

res.send(`
          <script>
            alert("Racord Upadated successfully");
            window.location.assign("/admin/top_banar/");
          </script>
         `);
});
});


module.exports=router;
