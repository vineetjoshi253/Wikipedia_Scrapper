		var crawled = new Object();
		crawled["Name"]=[];
		crawled["Info"]=[];
		crawled["PId"]=[];
		crawled["Link"]=[];

		$(document).ready(function(){
    		$("#butt").click(function(){
    			$("#div1").fadeOut(100,function(){
    					$(this).remove();
    			});
        		$("#div2").fadeOut(900,function(){
        				$(this).remove();
        		});
        		newScreen();
    		});
    		
		});

		function newScreen(){
				user_input=document.getElementById("start").value;
				var number=document.getElementById("number").value;
				searchWiki(user_input,number);		
		}

		var count=0;
		searchURl='https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
		contentURL='https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';		
		var stack=[];

		function searchWiki(term,number){
			url=searchURl+term;
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function(){
				if(this.readyState == 4 && this.status==200)
				{
					var myObj=JSON.parse(this.responseText);
					parseObj(myObj,number);

				}
			}
			xmlhttp.open("GET",url,true);
			xmlhttp.send();
		}

		function parseObj(myObj,number){
			var len=myObj[1].length;
			if(count==0)
			{
				$("#456").append("Articles related to the keyword "+user_input+ ":");
				for (i=0;i<len;i++) {
					$("ol").append('<li>'+myObj[1][i]+'</br>'+'Visit Wikipedia: '+'<a style="color:grey;" href="'+myObj[3][i]+'">'+myObj[1][i]+'</a>'+'</li>');
				}
			}
			var x=Math.floor(Math.random()*len);
			article=myObj[1][x];
			if(article==null)
			{
				x=stack.pop();
				parseContent(x,number);
			}
			else
			{
				crawled["Name"]=crawled["Name"].concat([article]);
				crawled["Info"]=crawled["Info"].concat([myObj[2][x]]);
				crawled["Link"]=crawled["Link"].concat([myObj[3][x]]);
				article=article.replace(/ /g,"_");
				content(number);
			}
		}

		function content(number){
			var conURL=contentURL+article;
			
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function(){
				if(this.readyState == 4 && this.status==200)
				{
					var myContent=JSON.parse(this.responseText);
					stack.push(myContent);
					parseContent(myContent,number);
				}
			}
			xmlhttp.open("GET",conURL,true);
			xmlhttp.send();
		}

		function parseContent(myContent,number)
		{
			if(Object.keys(myContent)[0]=="warnings")
			{
				x=stack.pop();
				parseContent(x);
			}
			else{


				var pageID=Object.keys(myContent.query.pages)[0];
				crawled["PId"]=crawled["PId"].concat([pageID]);
				
				if (myContent.query.pages[pageID].revisions==undefined) {
					x=stack.pop();
					searchWiki(x,number);	
				}
				var content= myContent.query.pages[pageID].revisions[0]['*'];
				var RegE=/\[\[\w{4,}\]\]/g;
				var word=content.match(RegE);
				if(word==null)
				{
					RegE=/\w{5,}/g;
					word=content.match(RegE);	
				}
				
				var length=word.length;
				var x=Math.floor(Math.random()*length);
				term=word[x].replace(/\[\[/g,"");
				term=term.replace(/\]\]/g,"");
			
				
				
				count=count+1;
				
				if(count!=number)
				{
					searchWiki(term,number);	
				}
				else
				{
					var myJSON = JSON.stringify(crawled);
					console.log(myJSON);
					localStorage.setItem("json",myJSON);
					$("#123").append("Visit the JSON of scrapped articles: ");
					$("#456").append('<button class="bto btn" onclick="fun()">JSON</button>')
				}
				
			}
			
		}

		function fun(){
			window.location = "kk.html";	
		}