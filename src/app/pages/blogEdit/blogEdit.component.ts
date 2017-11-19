import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from '../../shared/services/crud.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'blog-edit-page',
    templateUrl: 'blogEdit.component.html'
})

export class BlogEditComponent implements OnInit {
    isNewPost: boolean = true;
    post: Blog = {
        _id: -1,
        title1:'',
        title2:'',
        body:'',
        imgSrc:'',
        imgText:'',
        continueReadingLink:'',
        publishedDate: undefined
    };
    constructor(private route: ActivatedRoute, private router:Router, 
        private toastr:ToastrService,private blogService: CrudService) { };

    ngOnInit() {
        this.route.params.subscribe((params) => {
            const id = params['id'];
            if (id != -1) {
                this.isNewPost = false;
                this.blogService.read('blogPosts', id).subscribe((resp) => {
                    this.post = <Blog>resp[0];
                }, (error) => {
                    this.toastr.error("Failed to load blog post!");                            
                });
            }
        });
    }
    public savePost() {
        if (this.isNewPost) {
            this.post.publishedDate = new Date();
            this.blogService.create('blogPosts', this.post).subscribe((resp) => {
                this.toastr.success("Successfully saved blog post.");                                           
                this.isNewPost = false;
                this.post._id = resp[0];
                const newRoute = 'blogadmin/' + this.post._id;
                this.router.navigate([newRoute]);           
            }, (error) => {
                this.toastr.error("Failed to save blog post!");                                           
            });
        }
        else {
            this.blogService.update('blogPosts', this.post._id, this.post).subscribe((resp) => {
                this.toastr.success("Successfully updated blog post.");                                           
            }, (error) => {
                this.toastr.error("Failed to update blog post!");                                           
            });
        }
    }
    public deletePost(){
        this.blogService.delete('blogPosts', this.post._id).subscribe((resp) => {
            this.toastr.success("Successfully deleted blog post.");                                           
            this.router.navigateByUrl('/blogadmin');                                          
        }, (error) => {
            this.toastr.error("Failed to delete blog post!");                                           
        });
    }
}